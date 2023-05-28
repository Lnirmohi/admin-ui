import React, { FC, useCallback, useEffect, useReducer, useState } from "react";
import { PageChangeHandler, TableColumn, TableProps } from "./table.types";
import "./Table.css";
import TableRow from "./tableRow";
import TablePagination from "./TablePagination";

type TableActionTypes = TableRowSetAction | TableToggleSelectedSetAction | TableTogleAllSelectedAction;

const tableRowReducer = (state: any[], action: TableActionTypes) => {

  switch (action.type) {

    case TableRowActionType.SET:

      state = action.payload.map((row) => ({...row, selected: false}));
      break;
    case TableRowActionType.TOGGLE_SELECTED: {

      const selectedToggledRow = state.find(item => item.id === action.payload);
  
      if(selectedToggledRow !== undefined) {
        state = [...state].map(item => {

          if(item.id === selectedToggledRow.id) {
            return {
              ...selectedToggledRow,
              selected: !selectedToggledRow.selected
            };
          }

          return item;
        });
      }
      break;
    }
    case TableRowActionType.TOGGLE_ALL_SELECTED:
      state = state.map(item => ({...item, selected: action.payload}));
      break;
    default:
      return state;
  }

  return state;
};
export enum TableRowActionType {
  SET = 'SET',
  TOGGLE_SELECTED = 'TOGGLE_SELECTED',
  TOGGLE_ALL_SELECTED = 'TOGGLE_ALL_SELECTED'
}

export type TableRowSetAction = {
  type: TableRowActionType.SET;
  payload: any[];
}

export type TableToggleSelectedSetAction = {
  type: TableRowActionType.TOGGLE_SELECTED;
  payload: string;
}

export type TableTogleAllSelectedAction = {
  type: TableRowActionType.TOGGLE_ALL_SELECTED,
  payload: boolean;
}

const Table = ({
  config,
  getRowId,
  onPageChange,
  onDeleteSelected,
}) => {
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>();
  const [activePage, setActivePage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [tableRows1, tableRowDispatch] = useReducer(tableRowReducer, []);


  useEffect(() => {
    setPageCount(Math.ceil(rows.length / pageSize));
  }, [pageSize, rows.length]);

  useEffect(() => {
    if (rows.length === 0) return;
    
    tableRowDispatch({
      type: TableRowActionType.SET,
      payload: rows
    });

    // add selected boolean to track row selection
    setTableRows(
      rows.map((row) => {
        return {
          ...row,
          selected: false,
        };
      })
    );
  }, [rows]);

  const handleRowSelectionToggle = useCallback(
    (selected: boolean, rowid: string) => {
      const rowIndexToSelect = tableRows.findIndex(
        (tableRow) => tableRow.id === rowid
      );

      setTableRows((prev) => {
        const tableRowsWithChangedRow = [...prev];

        tableRowsWithChangedRow.splice(rowIndexToSelect, 1, {
          ...rows[rowIndexToSelect],
          selected,
        });

        return tableRowsWithChangedRow;
      });
    },
    []
  );

  useEffect(() => {
    if(allSelected === undefined) return;

    tableRowDispatch({
      type: TableRowActionType.TOGGLE_ALL_SELECTED,
      payload: allSelected
    });
  }, [allSelected]);

  const handleDeleteSelected = () => {
    const selectedRows = tableRows1.filter(row => {
      return row.selected === true;
    })
    .map(item => item.id);

    onDeleteSelected(selectedRows);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th className="table--header__select-all">
              <input
                type="checkbox"
                checked={allSelected ?? false}
                onChange={() => {
                  setAllSelected(!allSelected);
                }}
              />
            </th>
            {columns.map((column) => (
              <th
                className="table--header__column"
                style={{ width: `${column["width"]}%` }}
                key={column.field}
              >
                {column.header}
              </th>
            ))}
            <th className="table--header__actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableRows1
            .slice((activePage - 1) * pageSize, activePage * pageSize)
            .map((row) => (
              <TableRow
                update={rowUpdate}
                rowDelete={rowDelete}
                rowData={row}
                columnData={columns}
                key={getRowId(row)}
                tableRowDispatch={tableRowDispatch}
              />
            ))}
        </tbody>
      </table>

      <div className="table--footer">
        <button onClick={handleDeleteSelected}>Delete Selected</button>
        <TablePagination
          pageCount={pageCount}
          handlePageChange={(newPage: number) => {
            setActivePage(newPage);
            onPageChange(newPage);
            setAllSelected(false);

            tableRowDispatch({
              type: TableRowActionType.TOGGLE_ALL_SELECTED,
              payload: false
            });
          }}
        />
      </div>
    </div>
  );
};

export default Table;
