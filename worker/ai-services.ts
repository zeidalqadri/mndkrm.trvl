import OpenAI from 'openai';
import { VendorRawItinerary, VendorRawItinerarySchema } from './schemas';
// This AIClient will be initialized in each function that needs it,
// grabbing the environment variables from the worker's context.
// This is a common pattern in Cloudflare Workers where you don't have a single entry point with DI.
class AIClient {
  private client: OpenAI;
  constructor(env: { CF_AI_BASE_URL: string; CF_AI_API_KEY: string }) {
    if (!env.CF_AI_BASE_URL || !env.CF_AI_API_KEY) {
      throw new Error("Missing Cloudflare AI Gateway environment variables");
    }
    this.client = new OpenAI({
      baseURL: env.CF_AI_BASE_URL,
      apiKey: env.CF_AI_API_KEY,
    });
  }
  async generateJsonCompletion(model: string, systemPrompt: string, userPrompt: string) {
    try {
      const completion = await this.client.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 4096,
      });
      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('AI model returned empty content.');
      }
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error calling AI model ${model}:`, error);
      throw new Error(`Failed to get response from ${model}.`);
    }
  }
  async generateTextCompletion(model: string, systemPrompt: string, userPrompt: string): Promise<string> {
    try {
        const completion = await this.client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.5,
            max_tokens: 1500,
        });
        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('AI model returned empty content for text completion.');
        }
        return content;
    } catch (error) {
        console.error(`Error calling AI model ${model} for text completion:`, error);
        throw new Error(`Failed to get text response from ${model}.`);
    }
  }
}
// Live implementation for mstprmpt context engineering engine
export async function getMstprmpt(initialPrompt: string, env: any): Promise<string> {
  console.log('Generating live mstprmpt_prompt from:', initialPrompt);
  const ai = new AIClient(env);
  const systemPrompt = "You expand sparse trip requests into rich planning briefs with constraints, traveler personas, seasonality, and risk notes. Return a single paragraph (≤1500 words).";
  const userPrompt = `initial_prompt: "${initialPrompt}"
Please return a single paragraph (≤1500 words) covering: goals, constraints, must-see themes, season/weather, crowd levels, mobility/diet needs if inferable, budget band assumptions (low/mid/high), potential visa/entry notes, and 1–2 strategic route concepts.`;
  return ai.generateTextCompletion('openai/gpt-4o', systemPrompt, userPrompt);
}
const itinerarySystemPrompt = "Produce a day-level bespoke itinerary with logistics suitable for traveler review. Do not invent bookings. Be explicit about assumptions. Return ONLY valid JSON that conforms to the Vendor Raw Itinerary JSON schema. Do not add any commentary outside the JSON object.";
const itineraryUserPrompt = (mstprmptPrompt: string) => `
<mstprmpt_prompt>
${mstprmptPrompt}
</mstprmpt_prompt>
Task: Generate a complete itinerary per the Vendor Raw Itinerary JSON schema. Use practical time blocks (morning/afternoon/evening), coherent routing, and include rationale for hotels/areas. No fake PNRs or reservation numbers. Be explicit about assumptions.
Return ONLY valid JSON.
`;
// Live implementation for OpenAI
export async function getOpenAIItinerary(mstprmptPrompt: string, env: any): Promise<VendorRawItinerary> {
  console.log('Generating live OpenAI itinerary...');
  const ai = new AIClient(env);
  const model = 'openai/gpt-4o';
  const jsonResponse = await ai.generateJsonCompletion(model, itinerarySystemPrompt, itineraryUserPrompt(mstprmptPrompt));
  // Add meta information that the model doesn't generate itself
  const fullResponse = {
    ...jsonResponse,
    meta: { model: model, timestamp: new Date().toISOString() },
  };
  const validation = VendorRawItinerarySchema.safeParse(fullResponse);
  if (!validation.success) {
    console.error("OpenAI response failed Zod validation:", validation.error.flatten());
    throw new Error("OpenAI response did not match the required schema.");
  }
  return validation.data;
}
// Live implementation for Anthropic
export async function getAnthropicItinerary(mstprmptPrompt: string, env: any): Promise<VendorRawItinerary> {
  console.log('Generating live Anthropic itinerary...');
  const ai = new AIClient(env);
  // NOTE: Using a powerful model available through the gateway.
  // The name might differ based on gateway setup, 'anthropic/claude-3-opus' is a common convention.
  const model = 'anthropic/claude-3-opus-20240229'; 
  const jsonResponse = await ai.generateJsonCompletion(model, itinerarySystemPrompt, itineraryUserPrompt(mstprmptPrompt));
  // Add meta information
  const fullResponse = {
    ...jsonResponse,
    meta: { model: model, timestamp: new Date().toISOString() },
  };
  const validation = VendorRawItinerarySchema.safeParse(fullResponse);
  if (!validation.success) {
    console.error("Anthropic response failed Zod validation:", validation.error.flatten());
    throw new Error("Anthropic response did not match the required schema.");
  }
  return validation.data;
}