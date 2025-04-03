import React, { useState } from "react";
import { Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem } from "@mui/material";
import { Add as AddIcon, Send as SendIcon } from "@mui/icons-material";
import FileUploadComponent from "./components/FileUploadComponent";
import DataTableComponent from "./components/DataTableComponent";
import SearchComponent from "./components/SearchComponent";
import AddEntryComponent from "./components/AddEntryComponent";
import EditEntryComponent from "./components/EditEntryComponent";
import ExportCSVComponent from "./components/ExportCSVComponent";
import type { Customer } from "./types";

const App: React.FC = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<Customer | null>(null);
  const [selectedRows, setSelectedRows] = useState<Customer[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const handleDataLoaded = (csvData: Customer[]): void => {
    if (csvData.length > 0) {
      setHeaders(Object.keys(csvData[0]));
      setData(csvData);
    }
  };

  const handleAdd = (newEntry: Customer): void => {
    setData([...data, newEntry]);
  };

  const handleEdit = (updatedEntry: Customer): void => {
    setData(data.map((entry) => (Object.values(entry).every((value) => value === Object.values(selectedEntry!)[0]) ? updatedEntry : entry)));
  };

  const handleDelete = (entryToDelete: Customer): void => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) {
      setData(data.filter((entry) => !Object.values(entry).every((value) => value === Object.values(entryToDelete)[0])));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSelectedRowsChange = (rows: Customer[]) => {
    setSelectedRows(rows);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {data.length <= 0 && (
        <>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Quản lý Khách hàng
          </Typography>

          <FileUploadComponent onDataLoaded={handleDataLoaded} />
        </>
      )}

      {data.length > 0 && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, verticalAlign: "end" }}>
            <SearchComponent onSearch={setSearchTerm} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom align="center">
                Quản lý Khách hàng
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={() => setOpenDialog(true)}
                disabled={selectedRows.length === 0}
                size="small"
                sx={{
                  minWidth: "120px",
                  height: "36px",
                  fontSize: "0.875rem",
                  textTransform: "none",
                  borderRadius: "4px",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Gửi sang CMS ({selectedRows.length})
              </Button>
              <ExportCSVComponent data={data} headers={headers} selectedRows={selectedRows} />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddDialogOpen(true)}
                size="small"
                sx={{
                  minWidth: "100px",
                  height: "36px",
                  fontSize: "0.875rem",
                  textTransform: "none",
                  borderRadius: "4px",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Thêm mới
              </Button>
            </Box>
          </Box>

          <DataTableComponent
            data={data}
            onEdit={(entry) => {
              setSelectedEntry(entry);
              setEditDialogOpen(true);
            }}
            onDelete={handleDelete}
            searchTerm={searchTerm}
            selectedRows={selectedRows}
            onSelectedRowsChange={handleSelectedRowsChange}
            onPageChange={handlePageChange}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <FileUploadComponent onDataLoaded={handleDataLoaded} />
          </Box>
        </>
      )}

      <AddEntryComponent open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onAdd={handleAdd} headers={headers} />

      <EditEntryComponent
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedEntry(null);
        }}
        onEdit={handleEdit}
        entry={selectedEntry}
        headers={headers}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Danh sách Email được chọn</DialogTitle>
        <DialogContent>
          <List>
            {selectedRows.map((row, index) => (
              <ListItem key={index}>{row["Primary Email"]}</ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
