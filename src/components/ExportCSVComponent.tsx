import React from 'react';
import { Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { Customer } from '../types';

interface ExportCSVComponentProps {
  data: Customer[];
  headers: string[];
  selectedRows: Customer[];
}

const ExportCSVComponent: React.FC<ExportCSVComponentProps> = ({ data, headers, selectedRows }) => {
  const handleExport = () => {
    // Chỉ xuất các dòng được chọn
    const csvContent = [
      headers.join(','),
      ...selectedRows.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Xử lý giá trị có dấu phẩy hoặc xuống dòng
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exported_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
      disabled={selectedRows.length === 0}
      size="small"
      sx={{
        minWidth: '120px',
        height: '36px',
        fontSize: '0.875rem',
        textTransform: 'none',
        borderRadius: '4px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      }}
    >
      Xuất CSV ({selectedRows.length})
    </Button>
  );
};

export default ExportCSVComponent; 