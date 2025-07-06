import React, { memo, useCallback } from "react";
import { IconButton, Tooltip, TableCell } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Type definitions
interface TableRow {
  rowId: string | number;
}

interface MoreAction {
  label: string;
  icon?: React.ReactElement;
  action?: (rowId: string | number, props: TableActionsCellProps) => void;
}

interface TableActionsCellProps {
  hideEdit?: boolean;
  editLabel?: string;
  onEdit?: (rowId: string | number, props: TableActionsCellProps) => void;
  hideDestroy?: boolean;
  destroyLabel?: string;
  destroyIcon?: React.ReactElement;
  onDestroy?: (rowId: string | number, props: TableActionsCellProps) => void;
  className?: string;
  moreActions?: MoreAction[];
  tableRow: TableRow;
  [key: string]: any; // For additional props
}

const TableActionsCell: React.FC<TableActionsCellProps> = ({
  hideEdit = false,
  editLabel = "Edit",
  onEdit = () => {},
  hideDestroy = false,
  destroyLabel = "Delete",
  destroyIcon,
  onDestroy = () => {},
  className,
  moreActions,
  tableRow,
  ...restProps
}) => {
  // Method to handle edit
  const handleEdit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onEdit(tableRow.rowId, { 
        hideEdit, 
        editLabel, 
        onEdit, 
        hideDestroy, 
        destroyLabel, 
        destroyIcon, 
        onDestroy, 
        className, 
        moreActions, 
        tableRow, 
        ...restProps 
      });
    },
    [tableRow, onEdit, hideEdit, editLabel, hideDestroy, destroyLabel, destroyIcon, onDestroy, className, moreActions, restProps]
  );

  // Method to handle destroy
  const handleDestroy = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDestroy(tableRow.rowId, { 
        hideEdit, 
        editLabel, 
        onEdit, 
        hideDestroy, 
        destroyLabel, 
        destroyIcon, 
        onDestroy, 
        className, 
        moreActions, 
        tableRow, 
        ...restProps 
      });
    },
    [tableRow, onDestroy, hideEdit, editLabel, onEdit, hideDestroy, destroyLabel, destroyIcon, className, moreActions, restProps]
  );

  // Method to handle more actions
  const handleMoreAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, action?: (rowId: string | number, props: TableActionsCellProps) => void) => {
      e.stopPropagation();
      if (action) {
        action(tableRow.rowId, { 
          hideEdit, 
          editLabel, 
          onEdit, 
          hideDestroy, 
          destroyLabel, 
          destroyIcon, 
          onDestroy, 
          className, 
          moreActions, 
          tableRow, 
          ...restProps 
        });
      }
    },
    [tableRow, hideEdit, editLabel, onEdit, hideDestroy, destroyLabel, destroyIcon, onDestroy, className, moreActions, restProps]
  );

  const slotProps = {
    popper: {
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [17, -12],
          },
        },
      ],
    },
  };

  return (
    <TableCell className="action-cell d-flex align-items-center" {...restProps}>
      {!hideEdit && (
        <Tooltip 
          title={editLabel} 
          placement="left" 
          slotProps={slotProps} 
          sx={{ fontSize: 10 }} 
          style={{ fontSize: "5px" }}
        >
          <IconButton onClick={handleEdit} aria-label={editLabel}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
      {moreActions?.map((actionItem, index) => (
        <Tooltip key={index} title={actionItem.label}>
          <IconButton
            onClick={(e) => handleMoreAction(e, actionItem.action)}
            aria-label={actionItem.label}
          >
            {!actionItem.icon && actionItem.label}
            {actionItem.icon && actionItem.icon}
          </IconButton>
        </Tooltip>
      ))}
      {!hideDestroy && (
        <Tooltip title={destroyLabel} placement="right" slotProps={slotProps}>
          <IconButton onClick={handleDestroy} aria-label={destroyLabel}>
            {destroyIcon && destroyIcon}
            {!destroyIcon && <DeleteIcon />}
          </IconButton>
        </Tooltip>
      )}
    </TableCell>
  );
};

export default memo(TableActionsCell);