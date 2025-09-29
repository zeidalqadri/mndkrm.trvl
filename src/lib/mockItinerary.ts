import { MondokromaItinerary } from './types';
export const mockItinerary: MondokromaItinerary = {
  "version": "v1",
  "provenance": {
    "openai_used": true,
    "anthropic_used": true,
    "reconciliation_notes": "Merged suggestions for transport and lodging, preferring options with clear rationale. Chronology confirmed."
  },
  "traveler_statement": "I want to go to Japan (Tokyo and Kyoto) on March 15–24, 2026 for 10 days.",
  "overview": "This 10-day journey through Japan balances the hyper-modern energy of Tokyo with the timeless elegance of Kyoto during the breathtaking cherry blossom season. You'll explore iconic landmarks, serene temples, and vibrant markets, all connected by Japan's world-class Shinkansen bullet train.",
  "dates": {
    "start": "2026-03-15",
    "end": "2026-03-24",
    "nights": 9
  },
  "route": [
    { "date": "2026-03-15", "location": "Tokyo, Japan" },
    { "date": "2026-03-19", "location": "Kyoto, Japan" }
  ],
  "day_by_day": [
    {
      "day": 1,
      "date": "2026-03-15",
      "location": "Tokyo, Japan",
      "morning": "Arrive at Narita (NRT) or Haneda (HND) Airport. Clear immigration and customs. Activate your Japan Rail Pass and take the Narita Express or Limousine Bus to your hotel in Shinjuku.",
      "afternoon": "Settle in and take a stroll around Shinjuku Gyoen National Garden for a peaceful introduction to Japanese aesthetics.",
      "evening": "Ascend the Tokyo Metropolitan Government Building for free panoramic views of the city skyline. Enjoy dinner in the vibrant Omoide Yokocho (Memory Lane).",
      "notes": "Purchase a Suica or Pasmo card for easy travel on local transport."
    },
    {
      "day": 2,
      "date": "2026-03-16",
      "location": "Tokyo, Japan",
      "morning": "Visit the historic Asakusa district. Explore Senso-ji Temple, Tokyo's oldest temple, and browse the traditional stalls of Nakamise-dori.",
      "afternoon": "Explore the Ueno Park, home to several museums like the Tokyo National Museum and Ueno Zoo. Enjoy the early cherry blossoms if they're in bloom.",
      "evening": "Experience the electric atmosphere of Akihabara, the hub of anime, manga, and electronics culture."
    },
    {
      "day": 3,
      "date": "2026-03-17",
      "location": "Tokyo, Japan",
      "morning": "Cross the iconic Shibuya Scramble Crossing, the world's busiest intersection. Visit the Hachiko statue.",
      "afternoon": "Explore the trendy boutiques and cafes of Harajuku's Takeshita Street and the more upscale Omotesando area.",
      "evening": "Discover the sophisticated nightlife and dining scene in the Ginza district."
    },
    {
      "day": 4,
      "date": "2026-03-18",
      "location": "Tokyo, Japan",
      "morning": "Take a day trip to Hakone, a mountainous town known for its hot springs (onsen) and stunning views of Mount Fuji.",
      "afternoon": "Enjoy a boat cruise on Lake Ashi and ride the Hakone Ropeway. Visit the Hakone Open-Air Museum.",
      "evening": "Return to Tokyo in the evening.",
      "options": ["Alternatively, visit the Ghibli Museum (tickets must be booked months in advance)."]
    },
    {
      "day": 5,
      "date": "2026-03-19",
      "location": "Kyoto, Japan",
      "morning": "Take an early morning Shinkansen (bullet train) from Tokyo Station to Kyoto Station (approx. 2.5 hours).",
      "afternoon": "Check into your hotel. Visit the stunning Fushimi Inari Shrine with its thousands of red torii gates.",
      "evening": "Explore the historic Gion district, Kyoto's famous geisha district. Enjoy dinner and perhaps a cultural performance."
    },
    {
      "day": 6,
      "date": "2026-03-20",
      "location": "Kyoto, Japan",
      "morning": "Visit Kinkaku-ji (Golden Pavilion), a Zen Buddhist temple covered in gold leaf.",
      "afternoon": "Explore the Arashiyama Bamboo Grove. Visit the Tenryu-ji Temple and walk across the Togetsukyo Bridge.",
      "evening": "Enjoy a traditional Kaiseki dinner in the Pontocho Alley."
    },
    {
      "day": 7,
      "date": "2026-03-21",
      "location": "Kyoto, Japan",
      "morning": "Explore the Higashiyama District. Walk the philosopher's path, especially beautiful during cherry blossom season.",
      "afternoon": "Visit Kiyomizu-dera Temple, offering incredible views over Kyoto from its wooden stage.",
      "evening": "Free evening to explore or revisit a favorite spot."
    },
    {
      "day": 8,
      "date": "2026-03-22",
      "location": "Kyoto, Japan",
      "morning": "Take a day trip to Nara, Japan's first permanent capital. Visit Todai-ji Temple to see the Great Buddha.",
      "afternoon": "Wander through Nara Park, famous for its friendly, free-roaming deer.",
      "evening": "Return to Kyoto. Enjoy a final dinner in the city."
    },
    {
      "day": 9,
      "date": "2026-03-23",
      "location": "Tokyo, Japan",
      "morning": "Enjoy a final morning in Kyoto, perhaps visiting Nishiki Market for some last-minute souvenirs and snacks.",
      "afternoon": "Take the Shinkansen back to Tokyo. Check into a hotel near Tokyo Station or Haneda/Narita for convenience.",
      "evening": "Enjoy a farewell dinner in Tokyo."
    },
    {
      "day": 10,
      "date": "2026-03-24",
      "location": "Tokyo, Japan",
      "morning": "Depending on your flight schedule, do some last-minute shopping or have a relaxed breakfast.",
      "afternoon": "Head to Narita (NRT) or Haneda (HND) Airport for your departure.",
      "evening": "Depart from Japan."
    }
  ],
  "logistics": {
    "documents": {
      "passport_validity_rule": "6 months beyond entry",
      "visa_required": "Depends on nationality (e.g., visa-waiver for US, UK, EU citizens for up to 90 days).",
      "proof_of_onward_travel": "Yes, often required by airlines at check-in.",
      "proof_of_accommodation": "Yes, required for immigration form upon arrival."
    },
    "transport": [
      { "segment": "Tokyo -> Kyoto", "mode": "Shinkansen (Bullet Train)", "details": "Approx. 2.5 hours. Covered by Japan Rail Pass. Reserve seats in advance." },
      { "segment": "Kyoto -> Nara", "mode": "Local Train", "details": "Approx. 45 minutes. Covered by Japan Rail Pass." }
    ],
    "lodging": [
      { "location": "Tokyo", "name": "Park Hyatt Tokyo or Hotel Gracery Shinjuku", "reasoning": "Park Hyatt for luxury and iconic views (as seen in 'Lost in Translation'). Hotel Gracery for a fun, central, and more affordable option." },
      { "location": "Kyoto", "name": "A traditional Ryokan in Gion or a modern hotel near Kyoto Station", "reasoning": "A Ryokan offers an authentic cultural experience. A hotel near the station provides maximum convenience for day trips." }
    ]
  },
  "budget": {
    "currency": "JPY",
    "band": "mid",
    "total_estimate": 450000
  },
  "packing_and_tips": [
    "Pack layers, as March weather can be unpredictable.",
    "Comfortable walking shoes are essential.",
    "Consider a portable Wi-Fi device or SIM card for connectivity.",
    "Cash is still widely used, especially at smaller shops and temples."
  ],
  "emergency_info": {
    "local_emergency_number": "110 for Police, 119 for Fire/Ambulance",
    "embassy_or_consulate": "Check for your specific country's embassy in Tokyo."
  },
  "format_notes": "Conforms to common documentation requested by border and airline staff: clear itinerary, contactable lodging, onward/return details."
};