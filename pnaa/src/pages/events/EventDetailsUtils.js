import { Box } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
function getDaySuffix(day) {
  if (day > 3 && day < 21) return "th"; // covers 11th through 19th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatDateString(dateString) {
  if (!dateString) return null;
  // Parse the input string
  const [year, month, day] = dateString.split("-").map(Number);

  // Create a Date object
  const date = new Date(year, month - 1, day);

  // Get the month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[date.getMonth()];

  // Get the day suffix
  const daySuffix = getDaySuffix(day);

  // Format the date string
  const formattedDate = `${monthName} ${day}${daySuffix}, ${year}`;

  return formattedDate;
}

export function convertMilitaryTime(militaryTime) {
  if (!militaryTime) {
    return "N/A";
  }
  // Split the input time string to get hours, minutes, and seconds
  const [hours, minutes] = militaryTime.split(":");

  // Convert the hours part to an integer
  let hoursInt = parseInt(hours, 10);

  // Determine the period (AM or PM)
  const period = hoursInt >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour to 12-hour format
  hoursInt = hoursInt % 12;
  hoursInt = hoursInt ? hoursInt : 12; // the hour '0' should be '12'

  // Return the formatted time
  return `${hoursInt}:${minutes} ${period}`;
}

// Specifies the columns of the datagrid
export const columns = [
  {
    // ValueGetter and Type are necessary for sorting
    valueGetter: (params) => params.row?.event?.name || "N/A",
    type: "string",
    // Field and header both help display the column name
    field: "name",
    headerName: "NAME",
    width: 350,
    renderCell: (params) => <div>{params.row?.event?.name || "N/A"}</div>,
  },
  {
    valueGetter: (params) => params.row?.event?.chapter || "N/A",
    type: "string",
    field: "chapter",
    headerName: "CHAPTER",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{params.row?.event?.chapter || "N/A"}</div>,
  },
  {
    valueGetter: (params) =>
      `${formatDateString(params.row?.event?.startDate) || "N/A"}  -  ${
        formatDateString(params.row?.event?.endDate) || "N/A"
      }`,
    type: "string",
    field: "dates",
    headerName: "DATES",
    width: 300,

    renderCell: (params) => (
      <div>
        {`${formatDateString(params.row?.event?.startDate) || "N/A"}  -  ${
          formatDateString(params.row?.event?.endDate) || "N/A"
        }`}
      </div>
    ),
    align: "center",
    headerAlign: "center",
  },
  {
    valueGetter: (params) =>
      `${convertMilitaryTime(params.row?.event?.startTime) || "N/A"} - ${
        convertMilitaryTime(params.row?.event?.endTime) || "N/A"
      }`,
    type: "string",
    field: "time",
    headerName: "TIME",
    width: 250,

    renderCell: (params) => (
      <div>{`${convertMilitaryTime(params.row?.event?.startTime) || "N/A"} - ${
        convertMilitaryTime(params.row?.event?.endTime) || "N/A"
      }`}</div>
    ),
    align: "center",
    headerAlign: "center",
  },
  {
    valueGetter: (params) => params.row?.event?.location || "N/A",
    type: "string",
    field: "location",
    headerName: "LOCATION",
    width: 600,

    renderCell: (params) => <div>{params.row?.event?.location || "N/A"}</div>,
    align: "center",
    headerAlign: "center",
  },
  {
    valueGetter: (params) => parseInt(params.row?.event?.contactHours) || 0,
    type: "number",
    field: "contact hours",
    headerName: "CONTACT HOURS",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <div>{parseInt(params.row?.event?.contactHours) || 0}</div>
    ),
  },
  {
    valueGetter: (params) => parseInt(params.row?.event?.attendees) || 0,
    type: "number",
    field: "attendees",
    headerName: "ATTENDEES",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <div>{parseInt(params.row?.event?.attendees) || 0}</div>
    ),
  },
  {
    valueGetter: (params) =>
      parseInt(params.row?.event?.participantsServed) || 0,
    type: "number",
    field: "participants_served",
    headerName: "PARTICIPANTS",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <div>{parseInt(params.row?.event?.participantsServed) || 0}</div>
    ),
  },
  {
    valueGetter: (params) => parseInt(params.row?.event?.volunteers) || 0,
    type: "number",
    field: "volunteers",
    headerName: "VOLUNTEERS",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <div>{parseInt(params.row?.event?.volunteers) || 0}</div>
    ),
  },
  {
    valueGetter: (params) => parseInt(params.row?.event?.volunteerHours) || 0,
    type: "number",
    field: "volunteer hours",
    headerName: "VOLUNTEER HOURS",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <div>{parseInt(params.row?.event?.volunteerHours) || 0}</div>
    ),
  },
  {
    valueGetter: (params) => params.row?.event?.region || "N/A",
    type: "string",
    field: "region",
    headerName: "REGION",
    width: 300,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{params.row?.event?.region || "N/A"}</div>,
  },

  {
    valueGetter: (params) =>
      params.row?.event?.archived ? "Archived" : "Not Archived",
    type: "string",
    field: "archived",
    headerName: "ARCHIVED",
    width: 300,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <div>{params.row?.event?.archived ? "Archived" : "Not Archived"}</div>
    ),
  },
];

export const QuickSearchToolbar = () => {
  return (
    <Box
      sx={{
        padding: "5px",
        backgroundColor: "rgba(224, 224, 224, 0.75)",
      }}
    >
      <GridToolbarQuickFilter />
    </Box>
  );
};

export const DataGridStyles = {
  border: 10,
  borderColor: "rgba(189,189,189,0.75)",
  borderRadius: 4,
  "& .MuiDataGrid-row:nth-child(even)": {
    backgroundColor: "rgba(224, 224, 224, 0.75)",
    fontFamily: `"Source-Serif 4", serif`,
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#2264E555",
    borderRadius: 0,
    fontFamily: `"Source-Serif 4", serif`,
  },
  "& .MuiDataGrid-row:nth-child(odd)": {
    backgroundColor: "#FFFFFF",
    fontFamily: `"Source-Serif 4", serif`,
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "rgba(224, 224, 224, 0.75)",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#2264E535",
    cursor: "pointer",
  },
};

export const Status = ({ text, backgroundColor, textColor, width, height }) => {
  const styles = {
    status: {
      backgroundColor: backgroundColor,
      color: textColor,
      width: width,
      height: height,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "10px",
    },
  };

  return <div style={styles.status}>{text}</div>;
};

// const navigateToChapterDetails = (chapter) => {
//   console.log("chapter", chapter);
//   navigate(`/chapter-dashboard/chapter-details/`, { state: { chapter } });
// };

export const ChapterButton = ({ text, backgroundColor, width, height }) => {
  const styles = {
    ChapterButton: {
      backgroundColor: backgroundColor,
      color: "white",
      width: width,
      height: height,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "6px",
    },
  };

  return <div style={styles.ChapterButton}>{text}</div>;
};
