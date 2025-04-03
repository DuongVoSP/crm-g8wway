import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { EditEntryProps, Customer } from '../types';

const EditEntryComponent: React.FC<EditEntryProps> = ({
  open,
  onClose,
  onEdit,
  entry,
  headers,
}) => {
  const [formData, setFormData] = useState<Customer>({} as Customer);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    }
  }, [entry]);

  const handleChange = (field: string) => (event: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    headers.forEach((header) => {
      if (!formData[header]) {
        newErrors[header] = 'Trường này là bắt buộc';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (validateForm()) {
      onEdit(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa thông tin khách hàng</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {headers.map((header) => (
            <TextField
              key={header}
              label={header}
              value={formData[header] || ''}
              onChange={handleChange(header)}
              error={!!errors[header]}
              helperText={errors[header]}
              fullWidth
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEntryComponent; 