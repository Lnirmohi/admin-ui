import React, { ChangeEvent, useState } from 'react';
import { debounce } from 'lodash';

export default function SearchTable({fields, callback}: {
  fields: string[];
  callback: (value: string) => void
}) {
  const [value, setValue] = useState('');
  const search = debounce((value: string) => {
    callback(value);
  }, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setValue(value);
    if(value.length === 0) return;
    search(value);
  };
  
  const placeHolder = fields.length > 1 
    ? `${fields.slice(0, -1).join(", ")} or ${fields.slice(-1)}`
    : `${fields[0]}`;
  return (
    <div className="flex flex-row gap-4 mt-2 mb-2 justify-end">
      <div className='flex flex-row gap-2 bg-white px-2 py-2 border-2 border-slate-400 rounded-md'>
        <input 
          type="text" 
          name="search" 
          id="search"
          value={value}
          onChange={handleChange}
          className='outline-transparent'
          placeholder={`Search for ${placeHolder}`} 
        />
        <button 
          className='hover:text-red-500 hover:cursor-pointer mr-2'
          onClick={() => {
            if(value.length) {
              setValue('');
              search('');
            }
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
