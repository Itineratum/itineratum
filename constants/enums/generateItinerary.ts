export enum GenerateItineraryFocus {
  attraction = "Attraction",
  localCuisine = "Local Cuisine",
  nature = "Nature",
  shopping = "Shopping",
}

export enum GenerateItineraryPreferredTransport {
  car = "Car",
  walk = "Walk",
  train = "Train",
  boat = "Boat",
  bus = "Bus",
}

export enum GenerateItineraryOtherRequirement {
  petFriendly = "Pet Friendly",
  familyFriendly = "Family Friendly",
  moreSustainable = "More Sustainable",
}

export enum GenerateItineraryStep {
  inputting = "inputting",
  validating = "validating",
  searchingHotels = "searchingHotels",
  searchingFlights = "searchingFlights",
  generatingItinerary = "generatingItinerary",
  generationComplete = "generationComplete",
}

export const defaultFocusRankings = {
  [GenerateItineraryFocus.attraction]: 0,
  [GenerateItineraryFocus.localCuisine]: 0,
  [GenerateItineraryFocus.nature]: 0,
  [GenerateItineraryFocus.shopping]: 0,
};
