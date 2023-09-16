import './App.css';
import "react-toastify/dist/ReactToastify.css";
import Dashboard from './dashbaord/components/Dashboard';
import { useEffect, useReducer } from 'react';
import { fetchUserData } from './services/userService';
import { UserDataDispatchContext, UsersDataContext } from './dashbaord/types/userDataContext';
import { TUserData } from './dashbaord/types/userTypes';
import userDataReducer, { setUserData } from './utils/user-reducer';

const initialUserDataState: TUserData[] = [];

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
