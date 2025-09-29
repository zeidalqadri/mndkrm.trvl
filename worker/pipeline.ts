import { InputEnvelope, MondokromaItinerary, VendorRawItinerary, VendorRawItinerarySchema } from './schemas';
import { getMstprmpt, getOpenAIItinerary, getAnthropicItinerary } from './ai-services';
import { reconcileItineraries } from './reconciliation';
export interface PipelineResult {
  success: boolean;
  itinerary: MondokromaItinerary | null;
  error?: string;
  reconciliationStatus?: 'full' | 'single-source' | 'failed';
}
// A simple function to transform a single raw itinerary into the final format.
// This is a simplified version of reconciliation for the single-source case.
function transformSingleItinerary(raw: VendorRawItinerary, travelerStatement: string): MondokromaItinerary {
    const day_by_day = raw.day_by_day;
    return {
        version: "v1",
        provenance: {
            openai_used: raw.meta.model.includes('gpt'),
            anthropic_used: raw.meta.model.includes('claude'),
            reconciliation_notes: `Single-source plan from ${raw.meta.model}. The other model failed to respond.`,
        },
        traveler_statement: travelerStatement,
        overview: raw.overview,
        dates: {
            start: day_by_day[0]?.date || new Date().toISOString().split('T')[0],
            end: day_by_day[day_by_day.length - 1]?.date || new Date().toISOString().split('T')[0],
            nights: day_by_day.length > 0 ? day_by_day.length - 1 : 0,
        },
        route: day_by_day.filter((d, i, arr) => i === 0 || d.location !== arr[i-1].location).map(d => ({ date: d.date, location: d.location })),
        day_by_day,
        logistics: {
            documents: {
                passport_validity_rule: "6 months beyond entry",
                visa_required: "Varies by nationality. Please check official sources.",
                proof_of_onward_travel: "Often required by airlines.",
                proof_of_accommodation: "Required for immigration.",
            },
            transport: raw.logistics.intra_trip_transport.map(t => ({ segment: t.segment, mode: t.mode, details: `Est. time: ${t.est_time}` })),
            lodging: raw.logistics.suggested_hotels.map(h => ({ location: h.area, name: h.name, reasoning: h.why })),
        },
        budget: {
            currency: raw.budget_estimate.currency,
            band: 'mid',
            total_estimate: raw.budget_estimate.mid,
        },
        packing_and_tips: raw.cultural_tips,
        emergency_info: {
            local_emergency_number: "Varies by country (e.g., 110/119 in Japan, 112 in EU, 911 in US)",
            embassy_or_consulate: "Please locate your country's embassy for your destination.",
        },
        format_notes: "Conforms to common documentation requested by border and airline staff: clear itinerary, contactable lodging, onward/return details.",
    };
}
export async function buildItinerary(input: InputEnvelope, env: any): Promise<PipelineResult> {
  try {
    const initialPrompt = `I want to go to ${input.where} on ${input.when} for ${input.howLong}.`;
    let mstprmptPrompt: string;
    try {
      mstprmptPrompt = await getMstprmpt(initialPrompt, env);
    } catch (e) {
      console.warn("mstprmpt failed, using initial prompt as fallback.", e);
      mstprmptPrompt = `For a trip to ${input.where} around ${input.when} for ${input.howLong}, assume a mid-range budget traveler interested in a mix of cultural sights and local experiences. The traveler is comfortable with public transport.`;
    }
    const [openaiResult, anthropicResult] = await Promise.allSettled([
      getOpenAIItinerary(mstprmptPrompt, env),
      getAnthropicItinerary(mstprmptPrompt, env),
    ]);
    const successfulItineraries: VendorRawItinerary[] = [];
    if (openaiResult.status === 'fulfilled') {
      successfulItineraries.push(openaiResult.value);
    } else {
      console.error("OpenAI API call failed in pipeline:", openaiResult.reason);
    }
    if (anthropicResult.status === 'fulfilled') {
      successfulItineraries.push(anthropicResult.value);
    } else {
      console.error("Anthropic API call failed in pipeline:", anthropicResult.reason);
    }
    if (successfulItineraries.length === 2) {
      const finalItinerary = reconcileItineraries(successfulItineraries[0], successfulItineraries[1], initialPrompt);
      return { success: true, itinerary: finalItinerary, reconciliationStatus: 'full' };
    }
    if (successfulItineraries.length === 1) {
      console.warn("Only one model succeeded. Transforming single-source itinerary.");
      const finalItinerary = transformSingleItinerary(successfulItineraries[0], initialPrompt);
      return { success: true, itinerary: finalItinerary, reconciliationStatus: 'single-source' };
    }
    return {
      success: false,
      itinerary: null,
      error: "Both AI models failed to generate an itinerary. This could be due to high demand or a configuration issue. Please try again.",
      reconciliationStatus: 'failed',
    };
  } catch (error) {
    console.error("Unhandled error in pipeline:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred during trip planning.";
    return {
      success: false,
      itinerary: null,
      error: message,
      reconciliationStatus: 'failed',
    };
  }
}