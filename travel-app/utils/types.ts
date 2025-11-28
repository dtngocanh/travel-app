export type FileObject = {
  uri: string;     // URI của ảnh (file://... trên app, blob URL hoặc base64 trên web)
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
