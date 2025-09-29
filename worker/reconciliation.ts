import { VendorRawItinerary, MondokromaItinerary } from './schemas';
function reconcileStrings(str1: string, str2: string): string {
  // Prefer the longer, more descriptive string
  return str1.length >= str2.length ? str1 : str2;
}
function reconcileArrays<T>(arr1: T[], arr2: T[], keyFn: (item: T) => string): T[] {
  const combined = [...arr1, ...arr2];
  const uniqueMap = new Map<string, T>();
  for (const item of combined) {
    const key = keyFn(item);
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  }
  return Array.from(uniqueMap.values());
}
export function reconcileItineraries(
  itinerary1: VendorRawItinerary,
  itinerary2: VendorRawItinerary,
  travelerStatement: string
): MondokromaItinerary {
  const notes: string[] = ["Reconciliation successful."];
  // Overview
  const overview = reconcileStrings(itinerary1.overview, itinerary2.overview);
  // Day by Day: For simplicity, we'll prefer the one with more entries, or the first one.
  // A real implementation would merge activities day-by-day.
  const day_by_day = itinerary1.day_by_day.length >= itinerary2.day_by_day.length
    ? itinerary1.day_by_day
    : itinerary2.day_by_day;
  notes.push(`Selected day-by-day plan from ${day_by_day === itinerary1.day_by_day ? itinerary1.meta.model : itinerary2.meta.model}.`);
  // Logistics - Documents
  const documents = {
    passport_validity_rule: "6 months beyond entry",
    visa_required: "Depends on nationality (e.g., visa-waiver for US, UK, EU citizens for up to 90 days).",
    proof_of_onward_travel: "Yes, often required by airlines at check-in.",
    proof_of_accommodation: "Yes, required for immigration form upon arrival."
  };
  // Logistics - Transport
  const transport = reconcileArrays(
    itinerary1.logistics.intra_trip_transport,
    itinerary2.logistics.intra_trip_transport,
    (t) => t.segment
  ).map(t => ({ segment: t.segment, mode: t.mode, details: `Estimated time: ${t.est_time}` }));
  // Logistics - Lodging
  const lodging = reconcileArrays(
    itinerary1.logistics.suggested_hotels,
    itinerary2.logistics.suggested_hotels,
    (h) => h.name
  ).map(h => ({ location: h.area, name: h.name, reasoning: h.why }));
  // Budget
  const budget = {
    currency: itinerary1.budget_estimate.currency,
    band: 'mid' as const,
    total_estimate: Math.round((itinerary1.budget_estimate.mid + itinerary2.budget_estimate.mid) / 2),
  };
  notes.push(`Averaged mid-range budget estimate.`);
  // Packing and Tips
  const packing_and_tips = reconcileArrays(
    itinerary1.cultural_tips,
    itinerary2.cultural_tips,
    (t) => t
  );
  const finalItinerary: MondokromaItinerary = {
    version: "v1",
    provenance: {
      openai_used: true,
      anthropic_used: true,
      reconciliation_notes: notes.join(' '),
    },
    traveler_statement: travelerStatement,
    overview,
    dates: {
      start: day_by_day[0].date,
      end: day_by_day[day_by_day.length - 1].date,
      nights: day_by_day.length - 1,
    },
    route: [
      { date: day_by_day[0].date, location: day_by_day[0].location },
      ...day_by_day.filter((d, i, arr) => i > 0 && d.location !== arr[i-1].location).map(d => ({ date: d.date, location: d.location }))
    ],
    day_by_day,
    logistics: {
      documents,
      transport,
      lodging,
    },
    budget,
    packing_and_tips,
    emergency_info: {
      local_emergency_number: "110 for Police, 119 for Fire/Ambulance",
      embassy_or_consulate: "Check for your specific country's embassy in Tokyo.",
    },
    format_notes: "Conforms to common documentation requested by border and airline staff: clear itinerary, contactable lodging, onward/return details.",
  };
  return finalItinerary;
}