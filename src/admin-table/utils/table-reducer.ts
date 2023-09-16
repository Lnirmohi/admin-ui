import { RowType } from "../types/table.types";

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
  payload: {
    id: string;
    selected: boolean;
  };
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

export const tableRowReducer = (state = initialstate, action: TableActionTypes) => {

  switch (action.type) {

    case TableRowActionType.SET:

      state = action.payload.map((row) => ({...row, selected: false}));
      break;
    case TableRowActionType.TOGGLE_SELECTED: {

      const selectedToggledRow = state.find(item => item.id === action.payload.id);
  
      if(selectedToggledRow !== undefined) {
        state = [...state].map(item => {

          if(item.id === selectedToggledRow.id) {
            return {
              ...selectedToggledRow,
              selected: action.payload.selected
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
