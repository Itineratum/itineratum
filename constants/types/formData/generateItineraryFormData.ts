import { GenerateItineraryPreferredTransport } from "@/constants/enums/generateItinerary";
import { Dayjs } from "dayjs";

export interface GenerateItineraryFormData {
  startDate: Dayjs;
  endDate: Dayjs;
  originCountry: string;
  userRequestedDestinations: UserRequestedDestination[];
  budget: number;
  totalHotelRooms: number;
  numPeopleTravelling: {
    adults: number;
    children: number;
  };
  focus: {
    attraction: number;
    localCuisine: number;
    nature: number;
    shopping: number;
  };
  preferredTransport: GenerateItineraryPreferredTransport;
  otherRequirements: {
    petFriendly: boolean;
    familyFriendly: boolean;
    moreSustainable: boolean;
  };
  localisation: {
    country: string;
    language: string;
    currency: string;
  };
}

// sample JSON
// {
//   "start_date": "2021-01-01",
//   "end_date": "2021-01-14",
//   "origin_country": "Singapore",
//   "user_requested_destinations": [
//       {
//           "name": "New York",
//           "start_date": "2021-01-01",
//           "end_date": "2021-01-03"
//       },
//       {
//           "name": "Los Angeles",
//           "start_date": "2021-01-04",
//           "end_date": "2021-01-14"
//       }
//   ],
//   "budget": 2000,
//   "total_hotel_rooms": 2,
//   "num_people_travelling": {
//       "adults": 3,
//       "children": 1
//   },
//   "focus": {
//       "attraction": 1,
//       "localCuisine": 2,
//       "nature": 3,
//       "shopping": 4
//   },
//   "preferred_transport": "car",
//   "other_requirements": {
//       "pet_friendly": true,
//       "family_friendly": true,
//       "more_sustainable": true
//   },
//   "localisation": {
//     "country": "sg",
//     "language": "en",
//     "currency": "sgd"
//   }
// }

export interface UserRequestedDestination {
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
}
