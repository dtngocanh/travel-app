import React, { createContext, useContext, useState, ReactNode } from "react";

interface BookingContextType {
  selectedTour: any | null;
  setSelectedTour: (tour: any) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTour, setSelectedTour] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <BookingContext.Provider
      value={{ selectedTour, setSelectedTour, selectedDate, setSelectedDate }}
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
