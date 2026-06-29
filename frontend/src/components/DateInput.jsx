import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/de";
import { ROLES } from "../config/roles";

dayjs.locale("de");

export default function DateInput({ label, value, onChange, role }) {
  const t = ROLES[role];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={(newValue) => {
          if (!newValue) {
            onChange("");
            return;
          }
          onChange(newValue.format("YYYY-MM-DD"));
        }}
        format="DD.MM.YYYY"
        slotProps={{
          textField: {
            fullWidth: true,
            variant: "outlined",
            sx: {
              mb: 2,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255,255,255,.06)",
                color: "white",
                borderRadius: "10px",
                "& fieldset": {
                  borderColor: "rgba(255,255,255,.15)",
                },
                "&:hover fieldset": {
                  borderColor: t.accent,
                },
                "&.Mui-focused fieldset": {
                  borderColor: t.accent,
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,.6)",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: t.accent,
              },
              "& input": {
                color: "white",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}