import React ,{ useContext }from "react";
import MainHeader from "./Header/Header";
import Login from "../Login/Login";
import Register from "../Login/Register";
import Consultant from "../Pages/Dashboard/Consultant/Consultant";
import Executive from "../Pages/Dashboard/Executive/Executive";
import Admin from "../Pages/Dashboard/Admin/Admin";
import authContext from "../Contexts/Auth/authContext";
import ForgotPasswordForm from "../Login/ForgotPassword";
import { Layout } from "antd"
import {
    BrowserRouter as Router,
    Route,
    Routes
  } from "react-router-dom";
import PasswordReset from "../Login/PasswordReset";

  function AppLayout() {
    const userToken  = useContext(authContext);
     console.log(userToken);

     if (userToken.userToken === null) {
        return (
          <Router>
             <Routes>
           <Route
         path="/" element={<Login />} /> 
         <Route
         path="/register" element={<Register />} /> 
         <Route
         path="/change-password" element={<ForgotPasswordForm />} />
         <Route
         path="/password-reset" element={<PasswordReset/>} />
          </Routes>
          </Router>
        
       )
   }
  else {
    return(
      <div className="App">
    <Router>
    <MainHeader />
      <Routes>
      <Route
         path="/" element={<Consultant />}/>
          <Route
         path="/executive-dashboard" element={<Executive />} />
         <Route
         path="/admin-dashboard" element={<Admin />} />
      </Routes>
    </Router>
    </div>
    )
  }
  }
    export default AppLayout