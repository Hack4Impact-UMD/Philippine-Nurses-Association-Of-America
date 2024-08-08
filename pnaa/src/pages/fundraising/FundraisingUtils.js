import { Box } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";

// Specifies the columns of the datagrid
export const columns = [
  {
    // ValueGetter and Type are necessary for sorting
    valueGetter: (params) => params.row?.fundraising?.fundraiserName || "N/A",
    type: "string",
    // Field and header both help display the column name
    field: "name",
    headerName: "NAME",
    width: 250,
    renderCell: (params) => (
      <div>{params.row?.fundraising?.fundraiserName || "N/A"}</div>
    ),
  },
  {
    valueGetter: (params) => parseInt(params.row?.fundraising?.amount) || 0,
    type: "number",
    field: "amount",
    headerName: "AMOUNT RAISED",
    width: 140,

    renderCell: (params) => (
      <div>$&nbsp;{parseInt(params.row?.fundraising?.amount) || 0}</div>
    ),
    align: "center",
    headerAlign: "center",
  },
  {
    valueGetter: (params) => params.row?.fundraising?.date || "N/A",
    type: "string",
    field: "date",
    headerName: "DATE",
    width: 250,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{params.row?.fundraising?.date || "N/A"}</div>,
  },
  {
    valueGetter: (params) => params.row?.fundraising?.chapterName || "N/A",
    type: "string",
    field: "chapter name",
    headerName: "CHAPTER NAME",
    width: 250,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <div>{params.row?.fundraising?.chapterName || "N/A"}</div>
    ),
  },
  {
    valueGetter: (params) => params.row?.fundraising?.note || "N/A",
    type: "string",
    field: "note",
    headerName: "NOTE",
    width: 250,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{params.row?.fundraising?.note || "N/A"}</div>,
  },
  {
    valueGetter: (params) =>
      params.row?.fundraising?.archived ? "Archived" : "Not Archived",
    type: "boolean",
    field: "archived",
    headerName: "ARCHIVED",
    width: 250,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <div>
        {params.row?.fundraising?.archived ? "Archived" : "Not Archived"}
      </div>
    ),
  },
];

export const QuickSearchToolbar = (gridAPI) => {
  let total = 0;
  const visibleRowIds = gridAPI.current.state.visibleRowsLookup;
  // Iterate over visible rows
  Object.keys(visibleRowIds).forEach((rowId) => {
    if (visibleRowIds[rowId] === false) return;
    total += parseInt(gridAPI.current.getRow(rowId)?.fundraising?.amount || 0);
  });
  return (
    <Box
      sx={{
        padding: "5px",
        backgroundColor: "rgba(224, 224, 224, 0.75)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "end",
      }}
    >
      <GridToolbarQuickFilter />
      <div
        style={{
          height: "30px",
          fontFamily: `"Source-Serif 4", serif`,
          fontSize: "1rem",
          fontWeight: "600",
          marginRight: "20px",
        }}
      >
        Total: ${total}
      </div>
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
