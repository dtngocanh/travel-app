import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface BookingContextType {
  selectedTour: any | null;
  setSelectedTour: (tour: any) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  clearBooking: () => void; 
}
interface Tour {
  id: string;
  name_tour: string;
  price_tour: number;
  location_tour: string;
  duration_tour: string;
  image_tour: string;
  reviews_tour: number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTour, setSelectedTourState] = useState<any | null>(null);
  const [selectedDate, setSelectedDateState] = useState<Date | null>(null);

  // Set tour → tự reset date nếu đổi tour
  const setSelectedTour = useCallback((tour: Tour | null) => {
    setSelectedTourState(tour);
    setSelectedDateState(null);
  }, []);

  const setSelectedDate = useCallback((date: Date | null) => {
    setSelectedDateState(date);
  }, []);

  // Reset toàn bộ booking (sau khi thanh toán)
  const clearBooking = useCallback(() => {
    setSelectedTourState(null);
    setSelectedDateState(null);
  }, []);


  return (
    <BookingContext.Provider
      value={{ selectedTour, setSelectedTour, selectedDate, setSelectedDate, clearBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
