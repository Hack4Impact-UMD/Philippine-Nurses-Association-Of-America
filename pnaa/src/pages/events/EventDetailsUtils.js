import { Box } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";

// Specifies the columns of the datagrid
export const columns = [
  {
    // ValueGetter and Type are necessary for sorting
    valueGetter: (params) => params.row.name || "N/A",
    type: "string",
    // Field and header both help display the column name
    field: "name",
    headerName: "NAME",
    width: 650,
    renderCell: (params) => <div>{params.row.name || "N/A"}</div>,
  },
  {
    valueGetter: (params) => params.row.chapter || "N/A",
    type: "string",
    field: "status",
    headerName: "STATUS",
    width: 140,

    renderCell: (params) => <div>{params.row.chapter || "N/A"}</div>,
    align: "center",
    headerAlign: "center",
  },
  {
    valueGetter: (params) => params.row.date || "N/A",
    type: "string",
    field: "date",
    headerName: "DATE",
    width: 200,

    renderCell: (params) => <div>{params.row.date || "N/A"}</div>,
    align: "center",
    headerAlign: "center",
  },
  {
    valueGetter: (params) => params.row.time || "N/A",
    type: "string",
    field: "time",
    headerName: "TIME",
    width: 140,

    renderCell: (params) => <div>{params.row.time || "N/A"}</div>,
    align: "center",
    headerAlign: "center",
  },
  {
    valueGetter: (params) => params.row.location || "N/A",
    type: "string",
    field: "location",
    headerName: "LOCATION",
    width: 600,

    renderCell: (params) => <div>{params.row.location || "N/A"}</div>,
    align: "center",
    headerAlign: "center",
  },
  {
    valueGetter: (params) => parseInt(params.row.contact_hrs) || 0,
    type: "number",
    field: "contact_hrs",
    headerName: "TOTAL HOURS",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row.contact_hrs) || 0}</div>,
  },
  {
    valueGetter: (params) => parseInt(params.row["attendee_#"]) || 0,
    type: "number",
    field: "attendee_#",
    headerName: "ATTENDEE #",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row["attendee_#"]) || 0}</div>,
  },
  {
    valueGetter: (params) => parseInt(params.row.participants_served) || 0,
    type: "number",
    field: "participants_served",
    headerName: "PARTICIPANTS",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row.participants_served) || 0}</div>,
  },
  {
    valueGetter: (params) => parseInt(params.row["volunteer_#"]) || 0,
    type: "number",
    field: "volunteer_#",
    headerName: "VOLUNTEER #",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row["volunteer_#"]) || 0}</div>,
  },
  {
    valueGetter: (params) => parseInt(params.row.total_volunteer_hours) || 0,
    type: "number",
    field: "total_volunteer_hours",
    headerName: "TOTAL VOLUNTEER HOURS",
    width: 300,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row.total_volunteer_hours) || 0}</div>,
  },
  {
    valueGetter: (params) => parseInt(params.row.region) || "N/A",
    type: "string",
    field: "region",
    headerName: "REGION",
    width: 300,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row.region) || "N/A"}</div>,
  },
  {
    valueGetter: (params) => parseInt(params.row.about) || "N/A",
    type: "string",
    field: "about",
    headerName: "ABOUT",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row.about) || "N/A"}</div>,
  },
  {
    valueGetter: (params) => parseInt(params.row.other_details) || "N/A",
    type: "string",
    field: "other_details",
    headerName: "OTHER DETAILS",
    width: 300,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row.other_details) || "N/A"}</div>,
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
