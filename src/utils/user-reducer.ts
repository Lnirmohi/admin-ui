import { 
  TUserData, 
  UserDataSetAction, 
  UserDataUpdateAction, 
  UserDataDeleteAction, 
  UserDataActionTypes 
} from "../dashbaord/types/userTypes";

type UserDataReducerActionType = UserDataSetAction | UserDataUpdateAction | UserDataDeleteAction;

const userDataReducer = (state: TUserData[], action: UserDataReducerActionType) => {

  const actionType = action.type;

  switch (action.type) {

    case UserDataActionTypes.SET:
      
      state = action.payload;

      break;
    case UserDataActionTypes.UPDATE: {

      const indexOfUserToUpdate = state.findIndex(data => data.id === action.payload.id);
      const updatedUserData = action.payload;
  
      if(indexOfUserToUpdate !== -1) {
        const stateCopy = state.slice();
        stateCopy.splice(indexOfUserToUpdate, 1, updatedUserData);
        state = stateCopy;
      }

      break;
    }
    case UserDataActionTypes.DELETE: {

      const stateCopy = state.slice();

      const userIdsToDelete = action.payload;
      
      userIdsToDelete.forEach(id => {
        const indexOfUserToDelete = stateCopy.findIndex(data => data.id === id);

        if(indexOfUserToDelete !== -1) {
          stateCopy.splice(indexOfUserToDelete, 1);
        }
      });

      state = stateCopy;

      break;
    }
    default:
      throw new Error('Invalid action type: ' + actionType);
  }

  return state;
};

export default userDataReducer;

export const setUserData = (data: TUserData[]): UserDataSetAction => ({
  type: UserDataActionTypes.SET,
  payload: data
});