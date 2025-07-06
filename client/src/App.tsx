import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactNotifications } from 'react-notifications-component'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications-component/dist/theme.css';
import "antd/dist/reset.css"
import "react-datepicker/dist/react-datepicker.css";
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-quill/dist/quill.snow.css';

import Routers from './Router';
import './App.css';
import { doLogin, doLogout } from './reducers/app';
import Loader from './components/common/Loader';
import { RootState } from './store';
import { User } from './reducers/app';

const timeout = 10 * 60 * 1000;

function App(): React.ReactElement {
  const [isLoggedIn, setLogin] = useState<boolean>(false);
  const [isComponentReady, setComponentReady] = useState<boolean>(false);
  
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    if (!token) {
      const _token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (_token && user) {
        try {
          const parsedUser: User = JSON.parse(user);
          dispatch(doLogin({ token: _token, user: parsedUser }));
          setLogin(true);
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setComponentReady(true);
    } else {
      setLogin(true);
      setComponentReady(true);
    }
  }, [token, dispatch]);


  return (
    <>
      {isComponentReady ? (
        <>
          <ReactNotifications />
          <Routers auth={isLoggedIn} />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default App;