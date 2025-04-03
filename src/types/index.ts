export interface Customer {
  [key: string]: string;
}

export interface FileUploadProps {
  onDataLoaded: (data: Customer[]) => void;
}

export interface DataTableProps {
  data: Customer[];
  onEdit: (entry: Customer) => void;
  onDelete: (entry: Customer) => void;
  searchTerm: string;
  selectedRows: Customer[];
  onSelectedRowsChange: (rows: Customer[]) => void;
}

export interface SearchProps {
  onSearch: (term: string) => void;
}

export interface AddEntryProps {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: Customer) => void;
  headers: string[];
}

export interface EditEntryProps {
  open: boolean;
  onClose: () => void;
  onEdit: (entry: Customer) => void;
  entry: Customer | null;
  headers: string[];
}

export interface ExportCSVProps {
  data: Customer[];
  headers: string[];
} 