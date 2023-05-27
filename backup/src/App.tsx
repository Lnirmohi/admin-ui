import './App.css';
import "react-toastify/dist/ReactToastify.css";
import Dashboard from './dashbaord/Dashboard';
import { useEffect, useReducer } from 'react';
import { TUserData, UserDataActionTypes, UserDataSetAction, UserDataUpdateAction } from './types/userTypes';
import { fetchUserData } from './services/userService';
import { UserDataDispatchContext, UsersDataContext } from './context/userDataContext';


const initialUserDataState: TUserData[] = [];

const userDataReducer = (state: TUserData[], action: UserDataSetAction | UserDataUpdateAction) => {

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

      const indexOfUserToDelete = state.findIndex(data => data.id === action.payload.id);

      if(indexOfUserToDelete !== -1) {
        const stateCopy = state.slice();
        state.splice(indexOfUserToDelete, 1);
        state = stateCopy;
      }

      break;
    }
    default:
      throw new Error('Invalid action type: ' + actionType);
  }

  return state;
};

const setUserData = (data: TUserData[]): UserDataSetAction => ({
  type: UserDataActionTypes.SET,
  payload: data
});

function App() {

  const [userData, dispatch] = useReducer(userDataReducer, initialUserDataState);
  
  useEffect(() => {
    
    fetchUserData().then(data => {

      dispatch(setUserData(data));
    });
  }, []);

  return (
    <UsersDataContext.Provider value={userData}>
      <UserDataDispatchContext.Provider value={dispatch} >
        <Dashboard />
      </UserDataDispatchContext.Provider>
    </UsersDataContext.Provider>
  );
}

export default App;
