import React from "react";
import { Menu } from "antd";
import {
    useNavigate,
  } from "react-router-dom";
  import authContext from "../Contexts/Auth/authContext";

function Logout(){
    const navigate = useNavigate();
    // const location = useLocation();
    const auth = useContext(authContext);
    const handleLagout = async (e) => {
      e.preventDefault();
      navigate("/");
      sessionStorage.removeItem("User_Token");
      auth.updateUserToken();
    };
    
    return(
        <Menu
        className="ant-menu-light logout"
        items={[
          {
            label: (
              <a href="#" onClick={handleLagout}>
                Logout
              </a>
            ),
            key: "0",
          },
        ]}
      />
    )
}
export default Logout