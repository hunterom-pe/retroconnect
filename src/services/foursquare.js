// Foursquare Places API integration with offline fallback simulation

const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;

// Predefined local database of real venues for Phoenix and New York zones
export const MOCK_VENUES = [
  // Phoenix - Downtown
  {
    fsq_id: "venue_cobra",
    name: "Cobra Arcade Bar",
    address: "801 N 2nd St",
    city: "Phoenix",
    zone: "Downtown",
    formatted_address: "801 N 2nd St, Phoenix, AZ 85004",
    price: 2,
    rating: 8.7,
    categories: ["Arcade Bar", "Nightlife"],
    open_now: true,
    hours_display: "Open Daily 4 PM - 2 AM",
    amenities: ["Retro Arcades", "Outdoor Patio", "DJ Beats", "Credit Cards"]
  },
  {
    fsq_id: "venue_valley",
    name: "Valley Bar",
    address: "130 N Central Ave",
    city: "Phoenix",
    zone: "Downtown",
    formatted_address: "130 N Central Ave, Phoenix, AZ 85004",
    price: 2,
    rating: 9.1,
    categories: ["Speakeasy", "Cocktail Lounge", "Music Venue"],
    open_now: true,
    hours_display: "Open Daily 6 PM - 2 AM",
    amenities: ["Basement Entry", "Live Stage", "Board Games", "Cozy Booths"]
  },
  {
    fsq_id: "venue_gracies",
    name: "Gracies Tax Bar",
    address: "711 N 7th Ave",
    city: "Phoenix",
    zone: "Downtown",
    formatted_address: "711 N 7th Ave, Phoenix, AZ 85007",
    price: 1,
    rating: 8.5,
    categories: ["Dive Bar", "Neighborhood Spot"],
    open_now: true,
    hours_display: "Open Daily 4 PM - 2 AM",
    amenities: ["Huge Patio", "Jukebox", "Cheap Beer", "Late Night Menu"]
  },
  {
    fsq_id: "venue_linger",
    name: "Linger Longer Lounge",
    address: "6522 N 16th St",
    city: "Phoenix",
    zone: "Downtown",
    formatted_address: "6522 N 16th St, Phoenix, AZ 85016",
    price: 2,
    rating: 8.2,
    categories: ["Lounge", "Neighborhood Pub"],
    open_now: false,
    hours_display: "Open 4 PM - Midnight",
    amenities: ["Outdoor Courtyard", "DJs", "Trivia Nights", "Pool Table"]
  },
  // Phoenix - Tempe
  {
    fsq_id: "venue_caseys",
    name: "Casey Moore's Oyster House",
    address: "850 S Ash Ave",
    city: "Phoenix",
    zone: "Tempe",
    formatted_address: "850 S Ash Ave, Tempe, AZ 85281",
    price: 2,
    rating: 8.9,
    categories: ["Irish Pub", "Beer Garden", "Seafood Restaurant"],
    open_now: true,
    hours_display: "Open Daily 11 AM - 2 AM",
    amenities: ["Haunted Vibe", "Spacious Garden", "Local Drafts", "Historic Building"]
  },
  {
    fsq_id: "venue_yucca",
    name: "Yucca Tap Room",
    address: "29 W Southern Ave",
    city: "Phoenix",
    zone: "Tempe",
    formatted_address: "29 W Southern Ave, Tempe, AZ 85282",
    price: 1,
    rating: 8.6,
    categories: ["Dive Bar", "Music Venue", "Arcade"],
    open_now: true,
    hours_display: "Open 24 Hours / Live Shows 6 PM - 2 AM",
    amenities: ["Live Bands", "Pinball Arcade", "Craft Beer", "No Cover Charge"]
  },
  {
    fsq_id: "venue_sunbar",
    name: "Sunbar Tempe",
    address: "24 W 5th St",
    city: "Phoenix",
    zone: "Tempe",
    formatted_address: "24 W 5th St, Tempe, AZ 85281",
    price: 2,
    rating: 8.0,
    categories: ["Sports Bar", "Dance Club"],
    open_now: true,
    hours_display: "Open Daily 11 AM - 2 AM",
    amenities: ["Huge Patio", "Big Screens", "DJs", "College Crowd"]
  },
  // Phoenix - Old Town
  {
    fsq_id: "venue_bottled",
    name: "Bottled Blonde",
    address: "7340 E Indian Plaza",
    city: "Phoenix",
    zone: "Old Town",
    formatted_address: "7340 E Indian Plaza, Scottsdale, AZ 85251",
    price: 3,
    rating: 7.8,
    categories: ["Beer Garden", "Pizzeria", "Nightclub"],
    open_now: true,
    hours_display: "Open Daily 3 PM - 2 AM",
    amenities: ["Lively Atmosphere", "Outdoor Seating", "Valet Parking", "High Energy"]
  },
  {
    fsq_id: "venue_riot",
    name: "Riot House",
    address: "4425 N Saddlebag Trail",
    city: "Phoenix",
    zone: "Old Town",
    formatted_address: "4425 N Saddlebag Trail, Scottsdale, AZ 85251",
    price: 3,
    rating: 7.9,
    categories: ["Nightclub", "Lounge"],
    open_now: true,
    hours_display: "Open Daily 9 PM - 2 AM",
    amenities: ["DJs", "VIP Bottle Service", "Light Show", "Trendy Crowd"]
  },
  {
    fsq_id: "venue_coach",
    name: "Coach House",
    address: "7011 E Indian School Rd",
    city: "Phoenix",
    zone: "Old Town",
    formatted_address: "7011 E Indian School Rd, Scottsdale, AZ 85251",
    price: 1,
    rating: 8.4,
    categories: ["Dive Bar", "Historic Tavern"],
    open_now: true,
    hours_display: "Open Daily 10 AM - 2 AM",
    amenities: ["Christmas Lights Year-Round", "Historic Vibe", "Outdoor Patio", "Cheap Drinks"]
  },
  // New York - Manhattan
  {
    fsq_id: "venue_pdt",
    name: "Please Don't Tell (PDT)",
    address: "113 St Marks Pl",
    city: "New York",
    zone: "Manhattan",
    formatted_address: "113 St Marks Pl, New York, NY 10009",
    price: 3,
    rating: 9.3,
    categories: ["Speakeasy", "Cocktail Bar"],
    open_now: true,
    hours_display: "Open Daily 5 PM - 2 AM",
    amenities: ["Phone Booth Entrance", "Hot Dogs", "Reservations Required", "Intimate Spot"]
  },
  {
    fsq_id: "venue_deathco",
    name: "Death & Co",
    address: "433 E 6th St",
    city: "New York",
    zone: "Manhattan",
    formatted_address: "433 E 6th St, New York, NY 10009",
    price: 4,
    rating: 9.5,
    categories: ["Cocktail Lounge", "High-End Cocktail Bar"],
    open_now: true,
    hours_display: "Open Daily 6 PM - 2 AM",
    amenities: ["Craft Cocktails", "Intimate Setting", "Strict Door Limits", "Award-Winning Menu"]
  },
  {
    fsq_id: "venue_mcsorleys",
    name: "McSorley's Old Ale House",
    address: "15 E 7th St",
    city: "New York",
    zone: "Manhattan",
    formatted_address: "15 E 7th St, New York, NY 10003",
    price: 1,
    rating: 9.0,
    categories: ["Historic Irish Pub", "Tavern"],
    open_now: true,
    hours_display: "Open Daily 11 AM - 1 AM",
    amenities: ["Sawdust Floors", "Light & Dark Ale Only", "Historic Memorabilia", "Cash Only"]
  },
  // New York - Brooklyn
  {
    fsq_id: "venue_union",
    name: "Union Pool",
    address: "484 Union Ave",
    city: "New York",
    zone: "Brooklyn",
    formatted_address: "484 Union Ave, Brooklyn, NY 11211",
    price: 2,
    rating: 8.8,
    categories: ["Music Venue", "Beer Garden", "Patio Bar"],
    open_now: true,
    hours_display: "Open Daily 12 PM - 2 AM",
    amenities: ["Large Courtyard", "Taco Truck", "Live Shows", "Fire Pit"]
  },
  {
    fsq_id: "venue_brooklynbowl",
    name: "Brooklyn Bowl",
    address: "61 Wythe Ave",
    city: "New York",
    zone: "Brooklyn",
    formatted_address: "61 Wythe Ave, Brooklyn, NY 11249",
    price: 3,
    rating: 9.2,
    categories: ["Bowling Alley", "Concert Venue", "Restaurant & Bar"],
    open_now: true,
    hours_display: "Open Daily 5 PM - Midnight",
    amenities: ["Bowling Lanes", "Live Concerts", "Blue Ribbon Fried Chicken", "Huge Space"]
  },
  {
    fsq_id: "venue_houseofyes",
    name: "House of Yes",
    address: "2 Wyckoff Ave",
    city: "New York",
    zone: "Brooklyn",
    formatted_address: "2 Wyckoff Ave, Brooklyn, NY 11237",
    price: 3,
    rating: 9.4,
    categories: ["Dance Club", "Nightclub", "Art Space"],
    open_now: true,
    hours_display: "Open Thu-Sun 10 PM - 4 AM",
    amenities: ["Aerial Performers", "Themed Costumes Required", "Outdoor Deck", "Vibrant Decor"]
  },
  // Cupertino - App Store Reviewer Mode
  {
    fsq_id: "venue_cafemacs",
    name: "Caffe Macs",
    address: "1 Infinite Loop",
    city: "Cupertino",
    zone: "HQ",
    formatted_address: "1 Infinite Loop, Cupertino, CA 95014",
    price: 2,
    rating: 8.9,
    categories: ["Corporate Cafe", "Lounge"],
    open_now: true,
    hours_display: "Open Mon-Fri 8 AM - 5 PM",
    amenities: ["Apple Employees Only", "Scenic Seating", "Reviewer Mode", "Gourmet Foods"]
  },
  {
    fsq_id: "venue_infiniteloop",
    name: "Infinite Loop Lounge",
    address: "2 Infinite Loop",
    city: "Cupertino",
    zone: "HQ",
    formatted_address: "2 Infinite Loop, Cupertino, CA 95014",
    price: 3,
    rating: 9.0,
    categories: ["Developer Hangout", "Cocktail Bar"],
    open_now: true,
    hours_display: "Open Daily 4 PM - 10 PM",
    amenities: ["Apple History Trivia", "Craft Beer on Tap", "Developer Network", "Outdoor Deck"]
  },
  {
    fsq_id: "venue_applepark",
    name: "Apple Park Visitor Center Cafe",
    address: "10600 N Tantau Ave",
    city: "Cupertino",
    zone: "Campus",
    formatted_address: "10600 N Tantau Ave, Cupertino, CA 95014",
    price: 3,
    rating: 9.2,
    categories: ["Modern Cafe", "Sightseeing Spot"],
    open_now: true,
    hours_display: "Open Daily 9 AM - 6 PM",
    amenities: ["Scenic Terrace", "Apple Merchandise Shop", "Pour-Over Coffee", "iPads for AR Campus Tour"]
  }
];

/**
 * Searches Foursquare Places API. Falls back to mock data if key is missing or call fails.
 * @param {string} query Search terms (venue name)
 * @param {string} filterCity Optional city filter
 * @returns {Promise<Array>} List of venues with id, name, address, city, zone
 */
export async function searchVenues(query, filterCity = "") {
  const cleanQuery = (query || "").trim().toLowerCase();

  // If no API key or default dummy key, use simulated search
  if (!FOURSQUARE_API_KEY || FOURSQUARE_API_KEY === "YOUR_FOURSQUARE_API_KEY") {
    console.log(`[Foursquare API] Key not configured. Performing offline simulation search for: "${query}"`);
    return getOfflineSearchResults(cleanQuery, filterCity);
  }

  try {
    // Categories: Nightlife (10032), Dining and Drinking (13000)
    let url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}&categories=13000,10032&limit=10&fields=fsq_id,name,location,categories,price,rating,hours,features`;
    if (filterCity) {
      // Append region hints to help Foursquare resolve locations accurately
      const nearHint = filterCity.toLowerCase() === "phoenix" ? "Phoenix, AZ" : "New York, NY";
      url += `&near=${encodeURIComponent(nearHint)}`;
    }
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: FOURSQUARE_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Foursquare API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter Foursquare results to make sure they reside in the requested city/metro zone
    const targetResults = (data.results || []).filter(place => {
      if (!filterCity) return true;
      const locality = (place.location?.locality || "").toLowerCase();
      const region = (place.location?.region || "").toLowerCase();
      
      if (filterCity.toLowerCase() === "phoenix") {
        return (
          locality === "phoenix" || 
          locality === "tempe" || 
          locality === "scottsdale" || 
          region === "az" || 
          region === "arizona"
        );
      }
      if (filterCity.toLowerCase() === "new york") {
        return (
          locality === "new york" || 
          locality === "brooklyn" || 
          locality === "manhattan" || 
          region === "ny" || 
          region === "new york"
        );
      }
      return locality === filterCity.toLowerCase();
    });

    // Map Foursquare results to our layout schema
    return targetResults.map(place => {
      // Deduce zone based on locality or assign a generic one
      const city = place.location?.locality || (filterCity.toLowerCase() === "new york" ? "New York" : "Phoenix");
      const address = place.location?.address || "No Address Provided";
      
      // Auto-assign zone based on address/name or defaults
      let zone = "Downtown";
      if (city.toLowerCase() === "phoenix" || city.toLowerCase() === "scottsdale" || city.toLowerCase() === "tempe") {
        const lowerName = place.name.toLowerCase();
        const lowerAddress = address.toLowerCase();
        if (lowerAddress.includes("ash") || lowerAddress.includes("tempe") || lowerName.includes("tempe")) {
          zone = "Tempe";
        } else if (lowerAddress.includes("indian school") || lowerAddress.includes("saddlebag") || lowerAddress.includes("scottsdale") || lowerName.includes("blonde")) {
          zone = "Old Town";
        }
      } else if (city.toLowerCase() === "new york" || city.toLowerCase() === "brooklyn") {
        const lowerAddress = address.toLowerCase();
        if (lowerAddress.includes("brooklyn") || lowerAddress.includes("union ave") || lowerAddress.includes("wythe") || lowerAddress.includes("wyckoff")) {
          zone = "Brooklyn";
        } else {
          zone = "Manhattan";
        }
      }

      const rawLocality = (place.location?.locality || "").toLowerCase();
      const rawRegion = (place.location?.region || "").toLowerCase();
      const isNY = rawLocality === "new york" || rawLocality === "brooklyn" || rawLocality === "manhattan" || rawRegion === "ny" || rawRegion === "new york";
      const normalizedCity = isNY ? "New York" : "Phoenix";

      return {
        fsq_id: place.fsq_id,
        name: place.name,
        address: address,
        city: normalizedCity,
        zone: zone,
        formatted_address: place.location?.formatted_address || `${address}, ${city}`,
        price: place.price || null,
        rating: place.rating || null,
        categories: (place.categories || []).map(c => c.name),
        open_now: place.hours?.open_now !== undefined ? place.hours.open_now : null,
        hours_display: place.hours?.display || null,
        amenities: extractAmenities(place)
      };
    });

  } catch (err) {
    console.warn("Foursquare fetch failed, falling back to local simulation database:", err);
    return getOfflineSearchResults(cleanQuery, filterCity);
  }
}

// Local mock filter search function
function getOfflineSearchResults(query, filterCity) {
  let results = MOCK_VENUES;
  
  if (filterCity) {
    results = results.filter(v => v.city.toLowerCase() === filterCity.toLowerCase());
  }

  if (query) {
    results = results.filter(v => 
      v.name.toLowerCase().includes(query) || 
      v.zone.toLowerCase().includes(query) ||
      v.address.toLowerCase().includes(query)
    );
  }

  return Promise.resolve(results);
}

function extractAmenities(place) {
  const list = [];
  const feats = place.features;
  if (!feats) return list;
  
  if (feats.payment) {
    if (feats.payment.credit_cards?.accepts_credit_cards) list.push("Credit Cards");
  }
  if (feats.food_and_drink) {
    if (feats.food_and_drink.serves_beer) list.push("Beer");
    if (feats.food_and_drink.serves_wine) list.push("Wine");
    if (feats.food_and_drink.serves_cocktails) list.push("Cocktails");
  }
  if (feats.amenities) {
    if (feats.amenities.outdoor_seating) list.push("Outdoor Seating");
    if (feats.amenities.live_music) list.push("Live Music");
    if (feats.amenities.wifi === "free" || feats.amenities.wifi === "paid") list.push("Wi-Fi");
  }
  return list;
}
