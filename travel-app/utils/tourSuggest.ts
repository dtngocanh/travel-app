import { TourData, TourDetail } from "./types";

/* Parse "11 days" -> 11 */
export const parseDuration = (duration: string): number => {
  const num = parseInt(duration);
  return isNaN(num) ? 0 : num;
};

/* Chuẩn hóa intensity */
const normalizeIntensity = (desc?: string): "low" | "high" => {
  if (!desc) return "low";
  const text = desc.toLowerCase();
  if (text.includes("high") || text.includes("challenging")) return "high";
  return "low";
};

/* Chấm điểm 1 tour */
const calculateScore = (
  tour: TourData & { details?: TourDetail[] },
  user: {
    maxPrice: number;
    maxDays: number;
    intensity: "low" | "high";
  }
): number => {
  let score = 0;

  // Giá
  if (tour.price_tour <= user.maxPrice) score += 3;

  // Thời gian
  if (parseDuration(tour.duration_tour) <= user.maxDays) score += 2;

  // Intensity
  const tourIntensity = normalizeIntensity(
    tour.details?.[0]?.intensity_desc
  );
  if (tourIntensity === user.intensity) score += 2;

  // Review
  if (tour.reviews_tour >= 4.5) score += 1;

  return score;
};

/* XẾP HẠNG TOUR */
export const rankTours = (
  tours: (TourData & { details?: TourDetail[] })[],
  userPref: {
    maxPrice: number;
    maxDays: number;
    intensity: "low" | "high";
  }
) => {
  return tours
    .map(tour => ({
      tour,
      score: calculateScore(tour, userPref),
    }))
    .filter(item => item.score > 0) // loại tour không phù hợp
    .sort((a, b) => b.score - a.score)
    .map(item => item.tour);
};