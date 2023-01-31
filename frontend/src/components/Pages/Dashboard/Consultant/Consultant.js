import { Layout , theme} from "antd";
import React, { useContext } from "react";
import authContext from "../../../Contexts/Auth/authContext";
const { Header, Content, Footer, Sider } = Layout;

function Consultant(){

    const auth = useContext(authContext);
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    
    return(
        <Layout>

             <Layout className="site-layout">
             <Content>
        <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
        }}
      >
        

         { auth.currentUser.emp_type > 0 && (
         <h1>Consultant dashboard</h1>
         )}
         
    </div>
    </Content>
    </Layout>
    </Layout>
    )
    }
export default Consultant