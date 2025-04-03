export interface Customer {
  [key: string]: string;
}

export interface DataTableProps {
  data: Customer[];
  onEdit: (entry: Customer) => void;
  onDelete: (entry: Customer) => void;
  searchTerm: string;
  selectedRows: Customer[];
  onSelectedRowsChange: (rows: Customer[]) => void;
} 