import { DebouncedFunc } from "lodash";
import { ChangeEvent, RefObject } from "react";

type Props = {
  handleSearch: DebouncedFunc<
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => void
  >;
  placeHolder: string;
  searchRef: RefObject<HTMLInputElement>;
  handleClear: () => void;
};

export default function SearchUI({
  handleSearch,
  placeHolder,
  searchRef,
  handleClear,
}: Props) {
  
  return (
    <div className="flex flex-row gap-4 mt-2 mb-2 justify-end">

      <div className="flex flex-row gap-2 bg-white rounded-md">
        <input
          type="text"
          name="search"
          id="search"
          onChange={handleSearch}
          className="outline-2 p-2 rounded-md"
          placeholder={placeHolder}
          ref={searchRef}
        />

        <button
          className="hover:text-red-500 hover:cursor-pointer mr-2"
          onClick={handleClear}
        >
          Clear
        </button>
        
      </div>
    </div>
  );
}
