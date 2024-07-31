import { Box } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";

// Specifies the columns of the datagrid
export const columns = [
  {
    // ValueGetter and Type are necessary for sorting
    valueGetter: (params) => params.row.user.name || "N/A",
    type: "string",
    // Field and header both help display the column name
    field: "name",
    headerName: "NAME",
    width: 250,
    renderCell: (params) => <div>{params.row.user.name || "N/A"}</div>,
  },
  {
    valueGetter: (params) => params.row.user.chapterName || "N/A",
    type: "string",
    field: "chapter",
    headerName: "CHAPTER",
    width: 250,

    renderCell: (params) => <div>{params.row.user.chapterName || "N/A"}</div>,
    align: "center",
    headerAlign: "center",
  },
  {
    valueGetter: (params) => params.row.user.email || "N/A",
    type: "string",
    field: "email",
    headerName: "EMAIL",
    width: 250,

    renderCell: (params) => <div>{params.row.user.email || "N/A"}</div>,
    align: "center",
    headerAlign: "center",
  },
  {
    valueGetter: (params) => params.row.user.type || "N/A",
    type: "string",
    field: "type",
    headerName: "TYPE",
    width: 140,

    renderCell: (params) => <div>{params.row.user.type || "N/A"}</div>,
    align: "center",
    headerAlign: "center",
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
