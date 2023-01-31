import React, { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import AuthContext from './authContext'


function AuthState(props) {

  const [userState, setUserState] = useState();
  const [userToken, setUserToken] = useState('');
  const [currentUser, setCurrentUser] = useState();

  
  const updateUserToken = () => {
    const token = sessionStorage.getItem("User_Token");
    
    if (token !== '' && token !== null) {
      //console.log("Token", jwt_decode(token));
      setCurrentUser(jwt_decode(token));
      const userInfo = jwt_decode(token);
      setUserState(userInfo.emp_type);
    }
    else {
      setCurrentUser(currentUser);
    }
    setUserToken(token);
  }

  useEffect(() => {
    updateUserToken();
  }, [])

  return (
    <AuthContext.Provider value={{ userState, userToken, currentUser, updateUserToken }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthState