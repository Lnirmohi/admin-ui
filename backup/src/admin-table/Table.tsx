import React, { useEffect, useState } from 'react';
import { TableColumn, TableProps } from './table.types';
import "./Table.css";
import TableRow from './tableRow';
import TablePagination from './TablePagination';

const Table = ({rows, columns, pageSize, getRowId, rowUpdate, rowDelete, onPageChange}: TableProps) => {

  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    setPageCount(Math.ceil(rows.length/pageSize));
  }, [pageSize, rows.length]);

  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            <th className='table--header__select-all'>
              <input 
                type='checkbox' 
                checked={allSelected} 
                onChange={() => {setAllSelected(!allSelected);}}  
              />
            </th>
            {columns
              .map(column => (
                <th className='table--header__column' style={{width: `${column['width']}%`}} key={column.field}>{column.header}</th>
              ))
            }
            <th className='table--header__actions'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => 
            <TableRow update={rowUpdate} rowDelete={rowDelete} rowData={row} columnData={columns} key={getRowId(row)}/>
          )}
        </tbody>
      </table>
      
      <div className="table--footer">
        <button>Delete Selected</button>
        <TablePagination 
          pageCount={14}
          handlePageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Table;
