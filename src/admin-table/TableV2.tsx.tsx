import React, { FC, useCallback, useEffect, useReducer, useState } from "react";
import { PageChangeHandler, RowType, TableColumn, TableProps } from "./table.types";
import "./Table.css";
import TableRow from "./tableRow";
import TablePagination from "./TablePagination";
import SearchTable from "./SearchTable";

export enum TableRowActionType {
  SET = 'SET',
  TOGGLE_SELECTED = 'TOGGLE_SELECTED',
  TOGGLE_ALL_SELECTED = 'TOGGLE_ALL_SELECTED'
}

export type TableRowSetAction = {
  type: TableRowActionType.SET;
  payload: RowType[];
}

export type TableToggleSelectedSetAction = {
  type: TableRowActionType.TOGGLE_SELECTED;
  payload: string;
}

export type TableTogleAllSelectedAction = {
  type: TableRowActionType.TOGGLE_ALL_SELECTED,
  payload: {
    isAllSelected: boolean;
    visibleRowIds: string[]
  };
};

type TableActionTypes = TableRowSetAction | TableToggleSelectedSetAction | TableTogleAllSelectedAction;

type TableStateType = (RowType & {selected: boolean;})[];

const initialstate: TableStateType = [];

const tableRowReducer = (state = initialstate, action: TableActionTypes) => {

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
      state = [...state].map(item => (
        action.payload.visibleRowIds.includes(item.id)
        ? {...item, selected: action.payload.isAllSelected}
        : item
      ));
      break;
    default:
      return state;
  }

  return state;
};

const Table = ({
  config,
  getRowId,
  onPageChange,
  onDeleteSelected,
}: TableProps) => {

  const [allSelected, setAllSelected] = useState<boolean>();
  const [activePage, setActivePage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [tableRows, tableRowDispatch] = useReducer<typeof tableRowReducer>(tableRowReducer, []);
  // const [tableRowsToShow, setTableRowsToShow] = useState<T[]>();

  const {
    rows,
    columns,
    pageSize,
    rowUpdate,
    rowDelete,
  } = config;

  useEffect(() => {
    setPageCount(Math.ceil(tableRows.length / pageSize));
  }, [pageSize, tableRows.length]);

  useEffect(() => {
    if (rows.length === 0) return;
    
    tableRowDispatch({
      type: TableRowActionType.SET,
      payload: rows
    });

  }, [rows]);


  useEffect(() => {
    if(allSelected === undefined) return;

    tableRowDispatch({
      type: TableRowActionType.TOGGLE_ALL_SELECTED,
      payload: {
        isAllSelected: allSelected,
        visibleRowIds: tableRows
          .slice((activePage - 1) * pageSize, activePage * pageSize)
          .map(item => item.id)
      }
    });
  }, [allSelected]);
  

  const handleDeleteSelected = () => {
    
    const selectedRows = tableRows
      .filter(row =>  row.selected === true)
      .map(item => item.id);

    onDeleteSelected(selectedRows);

    if(allSelected) {
      setAllSelected(false);

      // handle delete all from last page
      if(activePage === pageCount) {
        setActivePage(activePage -1);
      }
    }
  };

  return (
    <div className="bg-slate-300 min-w-full font-poppins py-6">
      <div className="px-4">
        <SearchTable 
          fields={Object.keys(rows[0]).filter(item => item !== 'id')} 
          callback={(searchTerm) => {

            if(searchTerm.length === 0) {
              tableRowDispatch({
                type: TableRowActionType.SET,
                payload: rows
              });
            }
            
            const convertedSearchTerm = searchTerm.toLowerCase();
            
            const filteredRows = rows.filter(item => {
              
              
              let matchFound = false;
              
              for(const [key, value] of Object.entries(item)) {
                
                const convertedValue = `${value}`.toLowerCase();

                if(typeof value === 'string') {
                  if(convertedValue.includes(convertedSearchTerm)) {
                    matchFound = true;
                  }
                } else if(typeof value === 'number') {
                  if(convertedValue.includes(convertedSearchTerm)) {
                    matchFound = true;
                  }
                }
              }

              return matchFound;
            });

            tableRowDispatch({
              type: TableRowActionType.SET,
              payload: filteredRows
            });
          }}
        />
        <div id="table-head" className="bg-[#F7F8FA] rounded-t-lg shadow-lg">
          <div className="flex flex-row">
            <div className="pl-8 py-3">
              <input
                type="checkbox"
                checked={allSelected ?? false}
                onChange={() => {
                  setAllSelected(prev => !prev);
                }}
              />
            </div>
            {columns.map((column) => (
              <div
                className="px-2 py-3 text-center ml-2"
                style={{ width: `${column["width"]}%` }}
                key={column.field}
              >
                {column.header}
              </div>
            ))}
            <div className="px-2 py-3 text-center basis-36">Actions</div>
          </div>
        </div>

        <div id="table-body" className="bg-white space-y-2 h-[650px]">
          <>
          {tableRows.length === 0 ? (
            <div className="h-full flex flex-col justify-center">
              <p className="text-center text-3xl text-slate-400">
                No data found
              </p>
            </div>
            ) : (
              <>
                {tableRows && tableRows
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
              </>
            )
          }
          </>
        </div>
      </div>
      
      {pageCount > 0 &&
        <div className="px-4">
          <div className="bg-white flex flex-col gap-3 px-4 pt-4 rounded-b-lg">
            <button 
              onClick={handleDeleteSelected}
              className="
                self-start bg-transparent hover:bg-pink-500 text-pink-600 font-semibold 
                hover:text-white py-2 px-4 border border-pink-400 hover:border-transparent rounded"
            >
              Delete Selected
            </button>
            <TablePagination
              pageCount={pageCount}
              handlePageChange={(newPage: number) => {
                setActivePage(newPage);
                onPageChange(newPage);
                setAllSelected(false);

                tableRowDispatch({
                  type: TableRowActionType.TOGGLE_ALL_SELECTED,
                  payload: {
                    isAllSelected: false,
                    visibleRowIds: tableRows && tableRows
                      .slice((activePage - 1) * pageSize, activePage * pageSize)
                      .map(item => item.id)
                  }
                });
              }}
            />
          </div>
        </div>
      }
    </div>
  );
};

export default Table;
