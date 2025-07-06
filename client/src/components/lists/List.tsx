import React, { memo, useState, useMemo } from 'react';
import { alpha } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TableSortLabel,
  Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, Grid, Button
} from '@mui/material';
import { Delete as DeleteIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';

// Type definitions
interface Column {
  name: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  padding?: 'normal' | 'checkbox' | 'none';
  width?: number;
}

interface TableRow {
  _id: string | number;
  [key: string]: any;
}

interface SidebarState {
  collapsed: boolean;
}

interface RootState {
  sidebar: SidebarState;
}

// EnhancedTableHead Props
interface EnhancedTableHeadProps {
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: 'asc' | 'desc';
  orderBy: string;
  numSelected: number;
  rowCount: number;
  columns: Column[];
  onSortingChange: (columnDir: 'asc' | 'desc', orderColumn: string) => void;
}

// EnhancedTableToolbar Props
interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string;
  onSelectedDelete?: (selected: TableRow[]) => void;
  selected: TableRow[];
  top?: number;
  AddButton?: React.ReactElement;
}

// Main List Component Props
interface ListProps {
  initialOrder?: string;
  initialDir?: 'asc' | 'desc';
  rowPerPage?: number;
  enableSelection?: boolean;
  enableSorting?: boolean;
  rows: TableRow[];
  columns: Column[];
  onSortingChange?: (columnDir: 'asc' | 'desc', orderColumn: string) => void;
  onSelected?: (selected: TableRow[]) => void;
  title?: string;
  onSelectedDelete?: (selected: TableRow[]) => void;
  loading?: boolean;
  listBodyheight?: number;
  handleSelect?: (row: TableRow) => void;
  ReactPaginate?: React.ReactElement;
  AddButton?: React.ReactElement;
}

function EnhancedTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  columns,
  onSortingChange
}: EnhancedTableHeadProps) {
  const createSortHandler = (columnDir: 'asc' | 'desc', orderColumn: string) => {
    onSortingChange(columnDir, orderColumn);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox"> */}
        {/* <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          /> */}
        {/* </TableCell> */}
        {columns.map((column, key) => (
          <TableCell
            sx={{ padding: "4px 10px" }}
            key={key}
            align={column.align ? column.align : 'left'}
            padding={column.padding ? column.padding : 'normal'}
            width={column.width ? column.width : 150}
            sortDirection={orderBy === column.name ? order : false}
            style={{ fontWeight: "bold" }}
          >
            {/* {console.log("column",column)} */}
            {column.label}
            {/* <TableSortLabel
              active={orderBy === column.name}
              direction={orderBy === column.name ? order : 'asc'}
              onClick={() => createSortHandler(orderBy === column.name ? order : 'desc', column.name)}
              style={{ fontWeight: "bold" }}
            >
              {orderBy === column.name ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel> */}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({ 
  numSelected, 
  title, 
  onSelectedDelete, 
  selected, 
  top, 
  AddButton 
}: EnhancedTableToolbarProps) {
  const { collapsed } = useSelector((state: RootState) => state.sidebar);
  const width = collapsed ? "94%" : "80%";

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
      style={{
        // position: "fixed",
        // width,
        // top: top?top:104,
        background: "white",
        zIndex: 1,
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
      {AddButton}
    </Toolbar>
  );
}

const List: React.FC<ListProps> = ({
  rows,
  columns,
  rowPerPage = 50,
  onSortingChange = () => {},
  initialDir = 'desc',
  initialOrder = 'name',
  title = '',
  onSelectedDelete,
  loading = false,
  listBodyheight,
  handleSelect = () => {},
  ReactPaginate,
  AddButton
}) => {
  const [selected, setSelected] = useState<TableRow[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowPerPage);

  // const handleSelect = (row) => {
  // setRowId(row?.id);
  // console.log("Row",row);
  // const selectedIndex = selected.findIndex(newRow => newRow.id === row.id);
  // if (selectedIndex < 0) {
  //   setSelected([...selected, row])
  // } else {
  //   selected.splice(selectedIndex, 1);
  //   setSelected([...selected]);
  // }
  // };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (row: TableRow): boolean => {
    console.log("row", row);
    const index = selected.findIndex(newRow => newRow.id === row.id);
    return index > -1;
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      !loading && rows && rows.length ? rows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ) : [],
    [page, rowsPerPage, loading, rows],
  );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      const newSelected = visibleRows.map((n) => n);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  return (
    <Box>
      <Paper>
        <EnhancedTableToolbar
          selected={selected}
          numSelected={selected.length}
          title={title}
          onSelectedDelete={onSelectedDelete}
          AddButton={AddButton}
        />
        <TableContainer style={{ height: '70vh', overflowY: 'auto' }}>
          <Table
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={initialDir}
              orderBy={initialOrder}
              onSelectAllClick={handleSelectAll}
              onSortingChange={onSortingChange}
              rowCount={visibleRows.length}
              columns={columns}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                // const isItemSelected = isSelected(row);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={() => handleSelect(row)}
                    role="checkbox"
                    // aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={index}
                    // selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={() => handleSelect(row)}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell> */}
                    {
                      columns.map((column, i) =>
                        <TableCell
                          sx={{ lineHeight: "14px", padding: "10px 10px", fontSize: "13px" }}
                          component="th"
                          id={labelId}
                          scope="row"
                          key={i}
                          align={i === 0 ? "left" : "center"}
                        // height={15}
                        // sx={{height:"15"}}
                        >
                          {row[column.name]}
                        </TableCell>
                      )
                    }
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[50, 100, 200, 250]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
        {ReactPaginate}
      </Paper>
    </Box>
  );
};

export default memo(List);