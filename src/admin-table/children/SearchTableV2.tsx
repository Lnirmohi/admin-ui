import { ChangeEvent, ReactNode, RefObject, useMemo, useRef } from "react";
import { DebouncedFunc, debounce } from "lodash";

type SearchHandlerType = (e: ChangeEvent<HTMLInputElement>) => void;

type FunctionChildArgs = (
  handleSearch: DebouncedFunc<SearchHandlerType>,
  searchRef: RefObject<HTMLInputElement>,
  handleClear: () => void
) => ReactNode;

export function SearchTableV2({
  children,
  callback,
}: {
  children: FunctionChildArgs;
  callback: (value: string) => void;
}) {
  const searchRef = useRef<HTMLInputElement>(null);

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (value.length) {
      callback(value);
    }
  };

  const handleClear = () => {
   

    callback("");

    if (searchRef.current) {
      searchRef.current.value = "";
    }
  };

  const debouncedSearch = useMemo(() => {
    return debounce(handleChange, 1000);
  }, []);

  return <>{children(debouncedSearch, searchRef, handleClear)}</>;
}
