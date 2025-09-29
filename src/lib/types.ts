export interface MondokromaItinerary {
  version: string;
  provenance: {
    openai_used: boolean;
    anthropic_used: boolean;
    reconciliation_notes: string;
  };
  traveler_statement: string;
  overview: string;
  dates: {
    start: string;
    end: string;
    nights: number;
  };
  route: {
    date: string;
    location: string;
  }[];
  day_by_day: {
    day: number;
    date: string;
    location: string;
    morning: string;
    afternoon: string;
    evening: string;
    options?: string[];
    notes?: string;
  }[];
  logistics: {
    documents: {
      passport_validity_rule: string;
      visa_required: string;
      proof_of_onward_travel: string;
      proof_of_accommodation: string;
    };
    transport: {
      segment: string;
      mode: string;
      details: string;
      booking_link?: string;
    }[];
    lodging: {
      location: string;
      name: string;
      reasoning: string;
    }[];
  };
  budget: {
    currency: string;
    band: 'low' | 'mid' | 'high';
    total_estimate: number;
  };
  packing_and_tips: string[];
  emergency_info: {
    local_emergency_number: string;
    embassy_or_consulate: string | null;
  };
  format_notes: string;
}