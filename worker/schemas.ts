import { z } from 'zod';
// 4.1 Input envelope
export const InputEnvelopeSchema = z.object({
  where: z.string(),
  when: z.string(),
  howLong: z.string(),
});
export type InputEnvelope = z.infer<typeof InputEnvelopeSchema>;
// 4.4 Vendor raw itinerary (both models)
export const VendorRawItinerarySchema = z.object({
  meta: z.object({
    model: z.string(),
    timestamp: z.string().datetime(),
  }),
  assumptions: z.array(z.string()),
  overview: z.string(),
  day_by_day: z.array(
    z.object({
      day: z.number(),
      date: z.string(), // YYYY-MM-DD
      location: z.string(),
      morning: z.string(),
      afternoon: z.string(),
      evening: z.string(),
      options: z.array(z.string()).optional(),
      notes: z.string().optional(),
    })
  ),
  logistics: z.object({
    entry_requirements: z.array(z.string()),
    intra_trip_transport: z.array(
      z.object({
        mode: z.string(),
        segment: z.string(),
        est_time: z.string(),
      })
    ),
    suggested_flights: z.array(
      z.object({
        route: z.string(),
        est_duration: z.string(),
      })
    ).optional(),
    suggested_hotels: z.array(
      z.object({
        name: z.string(),
        area: z.string(),
        class: z.string(),
        why: z.string(),
      })
    ),
  }),
  budget_estimate: z.object({
    currency: z.string(), // ISO-4217
    low: z.number(),
    mid: z.number(),
    high: z.number(),
    inclusions: z.array(z.string()),
    exclusions: z.array(z.string()),
  }),
  safety_and_risk: z.array(z.string()),
  cultural_tips: z.array(z.string()),
  sources: z.array(z.string()).optional(),
});
export type VendorRawItinerary = z.infer<typeof VendorRawItinerarySchema>;
// 4.5 Reconciled mondokroma_itinerary (final)
export const MondokromaItinerarySchema = z.object({
  version: z.string(),
  provenance: z.object({
    openai_used: z.boolean(),
    anthropic_used: z.boolean(),
    reconciliation_notes: z.string(),
  }),
  traveler_statement: z.string(),
  overview: z.string(),
  dates: z.object({
    start: z.string(), // YYYY-MM-DD
    end: z.string(), // YYYY-MM-DD
    nights: z.number(),
  }),
  route: z.array(
    z.object({
      date: z.string(), // YYYY-MM-DD
      location: z.string(),
    })
  ),
  day_by_day: z.array(
    z.object({
      day: z.number(),
      date: z.string(), // YYYY-MM-DD
      location: z.string(),
      morning: z.string(),
      afternoon: z.string(),
      evening: z.string(),
      options: z.array(z.string()).optional(),
      notes: z.string().optional(),
    })
  ),
  logistics: z.object({
    documents: z.object({
      passport_validity_rule: z.string(),
      visa_required: z.string(),
      proof_of_onward_travel: z.string(),
      proof_of_accommodation: z.string(),
    }),
    transport: z.array(
      z.object({
        segment: z.string(),
        mode: z.string(),
        details: z.string(),
        booking_link: z.string().optional(),
      })
    ),
    lodging: z.array(
      z.object({
        location: z.string(),
        name: z.string(),
        reasoning: z.string(),
      })
    ),
  }),
  budget: z.object({
    currency: z.string(), // ISO-4217
    band: z.enum(['low', 'mid', 'high']),
    total_estimate: z.number(),
  }),
  packing_and_tips: z.array(z.string()),
  emergency_info: z.object({
    local_emergency_number: z.string(),
    embassy_or_consulate: z.string().nullable(),
  }),
  format_notes: z.string(),
});
export type MondokromaItinerary = z.infer<typeof MondokromaItinerarySchema>;