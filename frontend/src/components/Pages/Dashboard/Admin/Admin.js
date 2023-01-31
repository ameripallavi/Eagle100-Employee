import { Layout , theme} from "antd";
import React, { useContext } from "react";
import authContext from "../../../Contexts/Auth/authContext";

function Admin(){

    const auth = useContext(authContext);
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    
    return(
        <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
        }}
      >
         { auth.currentUser.emp_type > 0 && (
         <h1>Admin dashboard</h1>
         )}
    </div>
    )
    }
export default Admin