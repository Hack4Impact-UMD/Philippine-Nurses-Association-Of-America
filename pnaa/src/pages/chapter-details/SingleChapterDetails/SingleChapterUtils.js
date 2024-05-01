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
    // Converts new Date() to yyyy-mm-dd format
    valueGetter: (params) =>
      params.row.renewalDueDate < new Date().toISOString().split("T")[0]
        ? "Lapsed"
        : "Active",
    field: "status",
    headerName: "STATUS",
    width: 120,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Status
        text={
          params.row.renewalDueDate < new Date().toISOString().split("T")[0]
            ? "Lapsed"
            : "Active"
        }
        backgroundColor={
          params.row.renewalDueDate < new Date().toISOString().split("T")[0]
            ? "red"
            : "green"
        }
        textColor={"white"}
      />
    ),
  },
  {
    valueGetter: (params) => params.row.renewalDueDate || "",
    type: "string",
    field: "renewalDueDate",
    headerName: "RENEWAL DATE",
    width: 150,
    renderCell: (params) => <div>{params.row.renewalDueDate || ""}</div>,
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
};

const Status = ({ text, backgroundColor }) => {
  const styles = {
    fontFamily: `"Source-Serif 4", serif`,
    fontWeight: "700",
    fontSize: ".7rem",
    padding: "2px 10px",
    color: "white",
    backgroundColor: backgroundColor,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
  };

  return <div style={styles}>{text}</div>;
};
