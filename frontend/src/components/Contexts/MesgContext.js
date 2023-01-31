import React, { useContext, useEffect, useState } from "react";
import { message, message as msg, Modal } from "antd";
import { useMsal } from '@azure/msal-react';
import authContext from "./Auth/authContext";
const MsgContext = React.createContext();

export function useMsgContext() {
  return useContext(MsgContext)
}

export function MessageProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const { instance } = useMsal();
  const userToken = useContext(authContext);
  let modalState = false;




  async function logoutMSAL(instance) {
    const currentAccount = instance.getAccountByUsername(userToken.currentUser.email);

    const logoutHint = currentAccount.idTokenClaims.login_hint;
    await instance.logoutPopup({ logoutHint: logoutHint, postLogoutRedirectUri: "/" });
  }

  const message = {
    success: function (value) {
      msg.success(value);
    },
    warning: function (value) {
      msg.warning(value);
    },
    error: function (value) {
      if (value.message === 'Request failed with status code 401' && modalState === false) {
        modalState = true;
        Modal.warning({
          title: 'Session Timedout',
          content: 'Please use logout button to go back and login again.',
          okText: 'Logout',
          onOk: async () => {
            await logoutMSAL(instance)
            window.location.replace('/');
            sessionStorage.removeItem("User_Token");
            userToken.updateUserToken();
          }
          ,
          closable: false,
          keyboard: false,
        })
        return;
      }
      else {
        msg.error(value);
        //modalState = false;
      }
    }
  }

  const value = {
    message
  }

  useEffect(() => {
    setLoading(false);
    // logoutMSAL(instance)
  }, []);


  return (
    <MsgContext.Provider value={value}>
      {!loading && children}
    </MsgContext.Provider>
  );
}