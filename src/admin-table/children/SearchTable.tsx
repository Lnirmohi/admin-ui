import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';

export function SearchTable({fields, callback}: {
  fields: string[];
  callback: (value: string) => void
}) {
  
  const searchRef = useRef<HTMLInputElement>(null);

  const handleChange = ({target: {value}}: ChangeEvent<HTMLInputElement>) => {
    
    if(value.length === 0) {
      callback(value);
    }
  };

  const debouncedSearch = useMemo(() => {
    return debounce(handleChange, 2000);
  }, []);
  
  const placeHolder = fields.length > 1 
    ? `${fields.slice(0, -1).join(", ")} or ${fields.slice(-1)}`
    : `${fields[0]}`;

  return (
    <div className="flex flex-row gap-4 mt-2 mb-2 justify-end">
      <div className='flex flex-row gap-2 bg-white rounded-md'>
        <input 
          type="text" 
          name="search" 
          id="search"
          onChange={debouncedSearch}
          className='outline-2 p-2 rounded-md'
          placeholder={`Search for ${placeHolder}`}
          ref={searchRef}
        />
        <button 
          className='hover:text-red-500 hover:cursor-pointer mr-2'
          onClick={() => {
            callback('');

            if(searchRef.current) {
              searchRef.current.value = '';
            }
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
