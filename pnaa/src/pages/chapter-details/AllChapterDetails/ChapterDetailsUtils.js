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
    width: 250,
    renderCell: (params) => <div>{params.row.name || "N/A"}</div>,
  },
  {
    valueGetter: (params) =>
      (parseInt(params.row.totalActive) || 0) +
      (parseInt(params.row.totalLapsed) || 0),
    type: "number",
    field: "members",
    headerName: "MEMBER COUNT",
    width: 140,

    renderCell: (params) => (
      <div>
        {(parseInt(params.row.totalActive) || 0) +
          (parseInt(params.row.totalLapsed) || 0)}
      </div>
    ),
    align: "center",
    headerAlign: "center",
  },
  {
    valueGetter: (params) => parseInt(params.row.totalActive) || 0,
    type: "number",
    field: "totalActive",
    headerName: "ACTIVE #",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row.totalActive) || 0}</div>,
  },
  {
    valueGetter: (params) => parseInt(params.row.totalLapsed) || 0,
    type: "number",
    field: "totalLapsed",
    headerName: "LAPSED #",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row.totalLapsed) || 0}</div>,
  },
  {
    valueGetter: (params) => parseInt(params.row?.events) || 0,
    type: "number",
    field: "totalEvents",
    headerName: "EVENTS #",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row?.events) || 0}</div>,
  },
  {
    valueGetter: (params) => parseInt(params.row?.fundraisers) || 0,
    type: "number",
    field: "fundraisers",
    headerName: "FUNDRAISERS #",
    width: 190,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{parseInt(params.row?.fundraisers) || 0}</div>,
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
