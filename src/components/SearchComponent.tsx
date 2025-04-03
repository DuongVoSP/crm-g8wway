import React, { useState, useEffect, useCallback } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { SearchProps } from '../types';

const SearchComponent: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Debounce function
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      onSearch(searchTerm);
      setIsSearching(false);
    }, 1000); // 1000ms delay

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchTerm, onSearch]);

  return (
    <TextField
      size="small"
      placeholder="Tìm kiếm theo tên, email, số điện thoại..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
        endAdornment: isSearching ? (
          <CircularProgress 
            size={20} 
            sx={{ 
              color: 'primary.main',
              mr: 1
            }} 
          />
        ) : null,
      }}
      sx={{
        minWidth: '300px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px',
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
      }}
    />
  );
};

export default SearchComponent; 