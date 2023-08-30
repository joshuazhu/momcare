"use client";

import { Booking } from "@/schema";

export function BookingDetails({ booking }: { booking?: Booking }) {
  return (!booking || Object.keys(booking).length === 0) ? (
    <div>No Booking yet</div>
  ) : (
    <div>
      {booking?.dishes?.map((dish) => (
        <div key={dish}>{dish}</div>
      ))}
    </div>
  );
}
