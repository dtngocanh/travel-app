import { Timestamp } from "firebase/firestore"
export type FileObject = {
  uri: string;     
  name?: string;
  type?: string;
  file?: any;
};

export interface TourDetail {
  itinerary_desc: string;
  itinerary_accommodation?: string;
  itinerary_image?: string | FileObject;
  operator_name?: string;
  tour_style_title?: string;
  tour_style_desc?: string;
  guide_type_title?: string;
  guide_type_desc?: string;
  intensity_title?: string;
  intensity_desc?: string;
  language?: string;
  group_size?: string;
  age_range?: string;
}

export interface AddTourData {
  name_tour: string;
  price_tour: number;
  duration_tour: string;
  location_tour: string;
  image_tour?: string | FileObject;
  reviews_tour?: number;
  details?: TourDetail[];
}

export type TourData = {
  duration_tour: string
  id: string
  id_tour: number
  image_tour: string
  location_tour: string
  name_tour: string
  price_tour: number
  reviews_tour: number
  tourId: string
}
