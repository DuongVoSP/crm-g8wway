import React, { useState, ChangeEvent } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import Papa from 'papaparse';
import { FileUploadProps, Customer } from '../types';

const FileUploadComponent: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [error, setError] = useState<string>('');

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Vui lòng tải lên file CSV');
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          onDataLoaded(results.data as Customer[]);
          setError('');
        } else {
          setError('File CSV trống hoặc không hợp lệ');
        }
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        setError('Lỗi khi đọc file CSV: ' + error.message);
      }
    });
  };

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <input
        accept=".csv"
        style={{ display: 'none' }}
        id="csv-file-upload"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="csv-file-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUpload />}
          sx={{ mb: 2 }}
        >
          Tải lên file CSV
        </Button>
      </label>
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadComponent; 