import { db } from "../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export type UserAnswer = {
  budget: number;
  type: 'beach' | 'mountain' | 'city';
  days: number;
};

export function recommendTour(tours: any[], user: UserAnswer) {
  let bestTour = null;
  let bestScore = -1;

  for (const tour of tours) {
    let score = 0;

    if (tour.type === user.type) score += 3;
    if (tour.price <= user.budget) score += 2;
    if (Math.abs(tour.days - user.days) <= 1) score += 1;

    if (score > bestScore) {
      bestScore = score;
      bestTour = tour;
    }
  }

  return bestTour;
}
