"use client";

import { useAllBookingsQuery, AllBookingsQuery } from "@/__generated__/schema";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NavigationIcon from "@mui/icons-material/Navigation";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import Paper from "@mui/material/Paper";

export default function Home() {
  const [bookings, setBookings] = useState<AllBookingsQuery["bookings"]>();
  const [value, setValue] = useState(0);

  const data = useAllBookingsQuery({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!data.loading) {
      setBookings(data.data?.bookings || []);
    }
  }, [data, setBookings]);

  return (
    <div>
      <Box sx={{ "& > :not(style)": { m: 1 }, position: "fixed", bottom: 100, left: 300, right: 0 }}>
        <Fab color="secondary" aria-label="edit">
          <EditIcon />
        </Fab>
      </Box>

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </Paper>
    </div>
  );
}
