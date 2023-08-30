import { Dispatch, SetStateAction, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Meal } from "@/schema";
import { Booking } from "@/__generated__/schema";
import { BookingDetails } from "./bookingDetails";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export function BookingNavigation({ booking, setCurrentNav }: { booking?: Booking, setCurrentNav: Dispatch<SetStateAction<Meal>> }) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setCurrentNav(event.currentTarget.textContent as Meal)
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {Object.keys(Meal).map((meal) => (
            <Tab key={meal} label={meal} />
          ))}
        </Tabs>
      </Box>

      {Object.keys(Meal).map((meal, index) => (
        <CustomTabPanel key={meal} value={value} index={index}>
          <BookingDetails booking={booking} />
        </CustomTabPanel>
      ))}
    </Box>
  );
}
