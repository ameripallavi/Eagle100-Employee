import React, { useContext, useEffect, useState } from "react";
import authContext from "../../Contexts/Auth/authContext";
import { DownOutlined } from "@ant-design/icons";
import { Menu, Select, Dropdown, Space, Breadcrumb, Layout, theme } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
  DesktopOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Consultant from "../../Pages/Dashboard/Consultant/Consultant";
import { Outlet } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

function MainHeader() {
  const [collapsed, setCollapsed] = useState(false);
  const [empLink, setEmpLink] = useState(1);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const { Option } = Select;
  const auth = useContext(authContext);
  const handleLagout = async (e) => {
    e.preventDefault();

    navigate("/");
    sessionStorage.removeItem("User_Token");
    auth.updateUserToken();
  };

  const menu = (
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
  );
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const items = [
    getItem("Option 1", "1", <PieChartOutlined />),
    getItem("Option 2", "2", <DesktopOutlined />),
    getItem(auth.currentUser.first_name, "sub1", <UserOutlined />, [
      getItem("Tom", "3"),
      getItem("Bill", "4"),
      getItem("Alex", "5"),
    ]),
    getItem("Team", "sub2", <TeamOutlined />, [
      getItem("Team 1", "6"),
      getItem("Team 2", "8"),
    ]),
    getItem("Files", "9", <FileOutlined />),
    getItem(menu, "10", <LogoutOutlined />),
  ];

  useEffect(() => {
    if (location.pathname === "/executive-dashboard") {
      setEmpLink(2);
    }
    if (location.pathname === "/admin-dashboard") {
      setEmpLink(3);
    }
  }, []);

  return (
    
      
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div
              style={{
                height: 32,
                margin: 16,
                background: "rgba(255, 255, 255, 0.2)",
              }}
            />
            <Menu
              theme="dark"
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={items}
            />
          </Sider>
          <Layout className="site-layout">
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
              }}
            />
            { auth.currentUser.emp_type > 0 && (
            <Content
              style={{
                margin: "0 16px",
              }}
            >
              <Breadcrumb
                style={{
                  margin: "16px 0",
                }}
              >
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
              </Breadcrumb>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                }}
              >
                <Select value={empLink} dropdownMatchSelectWidth={false}>
                  <Option value={1}>
                    <Link to="/" onClick={() => setEmpLink(1)}>
                      consultant View
                    </Link>
                  </Option>
                  <Option value={2}>
                    <Link
                      to="/executive-dashboard"
                      onClick={() => setEmpLink(2)}
                    >
                      Executive View
                    </Link>
                  </Option>
                  {auth.currentUser.emp_type === 3 && (
                    <Option value={3}>
                      <Link to="/admin-dashboard" onClick={() => setEmpLink(3)}>
                        Admin View
                      </Link>
                    </Option>
                  )}
                </Select>
                <Outlet />
              </div>
            </Content>
            )}
            <Footer
              style={{
                textAlign: "center",
              }}
            >
              Ant Design ©2023 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
    
  );
}

export default MainHeader;
