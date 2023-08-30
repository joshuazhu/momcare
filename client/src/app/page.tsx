"use client";

import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { BookingDetails } from "@/components/bookingDetails";
import { BookingNavigation } from "@/components/bookingNavigation";
import { AllBookingsQuery, Booking, useAllBookingsQuery } from "@/__generated__/schema";
import { Meal } from "@/schema";

export default function Home() {
  const [bookings, setBookings] = useState<AllBookingsQuery["bookings"]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking>();
  const [currentMeal, setCurrentMeal] = useState<Meal>(Meal.Breakfast);

  const data = useAllBookingsQuery();

  useEffect(() => {
    if (!data.loading) {
      setBookings(data.data?.bookings || []);
    }
  }, [data, setBookings]);

  useEffect(() => {
    const matchedBooking = bookings?.find(b => b?.meal === currentMeal) || {}
    console.log('bookings', bookings)
    console.log('matchedBooking', matchedBooking)
    console.log('currentMeal', currentMeal)
    const {__typename, ...booking} = matchedBooking
    setCurrentBooking(booking)

  }, [bookings, currentMeal])

  return (
    <div>
      <BookingNavigation booking={currentBooking} setCurrentNav={setCurrentMeal}/>
      
      <Box
        sx={{
          "& > :not(style)": { m: 1 },
          position: "fixed",
          bottom: 100,
          right: 10,
        }}
      >
        <Fab color="secondary" aria-label="edit">
          <EditIcon />
        </Fab>
      </Box>
    </div>
  );
}
