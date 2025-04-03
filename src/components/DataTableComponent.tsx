import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Checkbox,
  Box,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import type { Customer } from '../types';

interface DataTableProps {
  data: Customer[];
  onEdit: (entry: Customer) => void;
  onDelete: (entry: Customer) => void;
  searchTerm: string;
  selectedRows: Customer[];
  onSelectedRowsChange: (rows: Customer[]) => void;
  onPageChange?: (page: number) => void;
}

const DataTableComponent: React.FC<DataTableProps> = ({
  data,
  onEdit,
  onDelete,
  searchTerm,
  selectedRows,
  onSelectedRowsChange,
  onPageChange
}) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    setPage(0);
    if (onPageChange) {
      onPageChange(0);
    }
  }, [searchTerm, onPageChange]);

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectRow = (row: Customer) => {
    const isSelected = selectedRows.some(selected => 
      Object.keys(selected).every(key => selected[key] === row[key])
    );
    if (isSelected) {
      onSelectedRowsChange(selectedRows.filter(selected => 
        !Object.keys(selected).every(key => selected[key] === row[key])
      ));
    } else {
      onSelectedRowsChange([...selectedRows, row]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      onSelectedRowsChange([]);
    } else {
      onSelectedRowsChange([...paginatedData]);
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? (
        <span key={i} style={{ 
          backgroundColor: '#fff3cd',
          padding: '0 2px',
          borderRadius: '2px',
          fontWeight: 600,
          color: '#856404'
        }}>
          {part}
        </span>
      ) : part
    );
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      // Nếu không có searchTerm, đặt các dòng được chọn lên đầu
      const selectedRowsOrdered = selectedRows.map(selectedRow => 
        data.find(row => 
          Object.keys(row).every(key => row[key] === selectedRow[key])
        )
      ).filter(Boolean) as Customer[];

      const unselectedRows = data.filter(row => 
        !selectedRows.some(selectedRow => 
          Object.keys(selectedRow).every(key => selectedRow[key] === row[key])
        )
      );

      return [...selectedRowsOrdered, ...unselectedRows];
    }
    
    // Nếu có searchTerm, tìm kết quả tìm kiếm
    const searchResults = data.filter((row: Customer) =>
      Object.values(row).some((value: string) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Tách các dòng được chọn và chưa được chọn từ kết quả tìm kiếm
    const selectedSearchResults = searchResults.filter(row => 
      selectedRows.some(selectedRow => 
        Object.keys(selectedRow).every(key => selectedRow[key] === row[key])
      )
    );

    const unselectedSearchResults = searchResults.filter(row => 
      !selectedRows.some(selectedRow => 
        Object.keys(selectedRow).every(key => selectedRow[key] === row[key])
      )
    );

    // Thêm các dòng được chọn nhưng không có trong kết quả tìm kiếm
    const selectedRowsNotInSearch = selectedRows.filter(selectedRow => 
      !searchResults.some(searchRow => 
        Object.keys(searchRow).every(key => searchRow[key] === selectedRow[key])
      )
    );

    return [...selectedRowsNotInSearch, ...selectedSearchResults, ...unselectedSearchResults];
  }, [data, searchTerm, selectedRows]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const isRowSelected = (row: Customer) => {
    return selectedRows.some(selected => 
      Object.keys(selected).every(key => selected[key] === row[key])
    );
  };

  // Hàm xử lý nội dung cell
  const renderCellContent = useCallback((content: string) => {
    const MAX_LENGTH = 100;
    if (content.length <= MAX_LENGTH) return content;
    
    return (
      <Tooltip 
        title={content} 
        arrow 
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              fontSize: '0.875rem',
              maxWidth: '400px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              padding: '8px 12px',
              '& .MuiTooltip-arrow': {
                color: 'rgba(0, 0, 0, 0.8)',
              },
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'inline-block',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'help',
          }}
        >
          {content.substring(0, MAX_LENGTH)}...
        </Box>
      </Tooltip>
    );
  }, []);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', maxWidth: '2400px', margin: '0 auto' }}>
      <TableContainer sx={{ maxHeight: '80vh', minHeight: '600px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                  checked={data.length > 0 && selectedRows.length === data.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {data.length > 0 &&
                Object.keys(data[0]).map((header: string) => (
                  <TableCell
                    key={header}
                    align="left"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      borderBottom: '2px solid #e0e0e0',
                      whiteSpace: 'nowrap',
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      color: '#333',
                      minWidth: '150px',
                      maxWidth: '300px',
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row: Customer, index: number) => (
              <TableRow 
                hover 
                key={index}
                onClick={() => handleSelectRow(row)}
                onDoubleClick={() => onEdit(row)}
                selected={isRowSelected(row)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.12)'
                    }
                  }
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isRowSelected(row)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRow(row);
                    }}
                  />
                </TableCell>
                {Object.values(row).map((value: string, cellIndex: number) => (
                  <TableCell
                    key={cellIndex}
                    align="left"
                    sx={{
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '300px',
                    }}
                  >
                    {renderCellContent(String(value))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTableComponent; 