/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, Dispatch, useEffect, useReducer, useRef, useState } from "react";
import { RowType, TableProps } from "../types/table.types";
import {
  TableRow,
  TablePagination,
  SearchTable,
  tableRowReducer,
  TableRowActionType,
  TableActionTypes,
} from "../index";

function useSearch(
  tableRows: (RowType & {selected: boolean;})[], 
  tableRowDispatch: Dispatch<TableActionTypes>
) {

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {

    if(tableRows.length === 0) return;

    const filteredRows = tableRows.filter((item) => {
      let matchFound = false;

      for (const [, value] of Object.entries(item)) {
        const convertedValue = `${value}`.toLowerCase();

        if (typeof value === "string") {
          if (convertedValue.includes(searchTerm)) {
            matchFound = true;
          }
        } else if (typeof value === "number") {
          if (convertedValue.includes(searchTerm)) {
            matchFound = true;
          }
        }
      }

      return matchFound;
    });

    tableRowDispatch({
      type: TableRowActionType.SET,
      payload: filteredRows,
    });

  }, [searchTerm]);

  return setSearchTerm;
}

const Table = ({
  config,
  getRowId,
  onPageChange,
  onDeleteSelected,
}: TableProps) => {

  const selectAllRowRef = useRef<HTMLInputElement>(null);

  const [activePage, setActivePage] = useState<number>(1);
  const [tableRows, tableRowDispatch] = useReducer<typeof tableRowReducer>(
    tableRowReducer,
    []
  );
  const setSearchTerm = useSearch(tableRows, tableRowDispatch);

  const { rows, columns, pageSize, rowUpdate, rowDelete } = config;

  const pageCount = Math.ceil(tableRows.length / pageSize);

  useEffect(() => {
    if (rows.length === 0) return;

    tableRowDispatch({
      type: TableRowActionType.SET,
      payload: rows,
    });
  }, [rows]);

  const handleDeleteSelected = () => {
    const selectedRows = tableRows
      .filter((row) => row.selected === true)
      .map((item) => item.id);

    onDeleteSelected(selectedRows);

    if (selectAllRowRef.current) {
      selectAllRowRef.current.checked = false;

      // handle delete all from last page
      if (activePage === pageCount) {
        setActivePage(activePage - 1);
      }
    }
  };

  const handleSearch = (searchTerm: string) => {
    if(selectAllRowRef.current) {
      selectAllRowRef.current.checked = false;
    }

    if (searchTerm.length === 0) {

      setSearchTerm(searchTerm);
      
      tableRowDispatch({
        type: TableRowActionType.SET,
        payload: rows,
      });

      return;
    }

    const convertedSearchTerm = searchTerm.toLowerCase();

    setSearchTerm(convertedSearchTerm);
  };

  const handlePageChange = (newPage: number) => {
    setActivePage(newPage);
    onPageChange(newPage);
    if(selectAllRowRef.current) {
      selectAllRowRef.current.checked = false;
    }

    tableRowDispatch({
      type: TableRowActionType.TOGGLE_ALL_SELECTED,
      payload: {
        isAllSelected: false,
        visibleRowIds:
          tableRows &&
          tableRows
            .slice((activePage - 1) * pageSize, activePage * pageSize)
            .map((item) => item.id),
      },
    });
  };

  const handleSelectAllToggle = ({target: {checked}}: ChangeEvent<HTMLInputElement>) => {

    if(selectAllRowRef.current) {
      selectAllRowRef.current.checked = checked;
    }

    tableRowDispatch({
      type: TableRowActionType.TOGGLE_ALL_SELECTED,
      payload: {
        isAllSelected: checked,
        visibleRowIds: tableRows
          .slice((activePage - 1) * pageSize, activePage * pageSize)
          .map((item) => item.id),
      },
    });
  };

  const fields = rows.length 
    ? Object.keys(rows[0]).filter((item) => item !== "id")
    : [];

  const placeHolder = fields.length > 1 
    ? `${fields.slice(0, -1).join(", ")} or ${fields.slice(-1)}`
    : fields.length === 1
    ? `${fields[0]}`
    : 'Table is empty';

  useEffect(() => {
    console.log(tableRows);
  }, [tableRows]);


  return (
    <div className="bg-slate-300 min-w-full font-poppins py-6">
      <div className="px-4">
        <SearchTable
          placeHolder={placeHolder}
          callback={(value) => handleSearch(value)}
        />
        <div id="table-head" className="bg-[#d4e3ff] rounded-t-lg shadow-lg">
          <div className="flex flex-row">
            {/* SELECT ALL INPUT */}
            <div className="pl-8 py-3">
              <input
                type="checkbox"
                checked={selectAllRowRef.current?.checked ?? false}
                onChange={handleSelectAllToggle}
                title="Select All"
                className="cursor-pointer"
                ref={selectAllRowRef}
              />
            </div>

            {/* COLUMNS */}
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

        {/* ROWS */}
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
                {tableRows &&
                  tableRows
                    .slice((activePage - 1) * pageSize, activePage * pageSize)
                    .map((row) => (
                      <TableRow
                        update={rowUpdate}
                        rowDelete={rowDelete}
                        rowData={row}
                        columnData={columns}
                        key={getRowId(row)}
                      >
                        <div className="flex flex-row justify-center pl-8 py-3">
                          <input 
                            type='checkbox'
                            checked={row.selected}
                            onChange={({target}) => {

                              const {checked} = target;

                              if(selectAllRowRef.current) {
                                selectAllRowRef.current.checked = false;
                              }
                              
                              tableRowDispatch({
                                type: TableRowActionType.TOGGLE_SELECTED,
                                payload: {
                                  id: row.id,
                                  selected: checked 
                                }
                              });
                            }}
                            title="Select"
                            className="cursor-pointer"
                          />
                        </div>
                      </TableRow>
                    ))}
              </>
            )}
          </>
        </div>
      </div>

      {/* TABLE FOOTER */}
      {pageCount > 0 && (
        <div className="px-4">
          <div className="bg-white flex flex-row gap-3 px-4 pt-4 rounded-b-lg">
            <button
              onClick={handleDeleteSelected}
              className="
                bg-transparent hover:bg-pink-500 text-pink-600 font-semibold 
                hover:text-white py-2 mb-4 px-4 border border-pink-400 hover:border-transparent rounded"
            >
              Delete Selected
            </button>
            <TablePagination
              pageCount={pageCount}
              handlePageChange={(value) => {
                handlePageChange(value);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
