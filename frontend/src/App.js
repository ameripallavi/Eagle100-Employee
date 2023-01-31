import AppLayout from "./components/Layout/AppLayout";
import "./assets/scss/_styles.scss";
import AuthState from "./components/Contexts/Auth/AuthState";
import { MessageProvider } from "./components/Contexts/MesgContext";
import Layout, { Content } from "antd/es/layout/layout";
//import { AuthProvider } from "./components/Contexts/Auth/AuthContext";

function App() {
  return (
  
          <AuthState>
            <MessageProvider>
              <div className="App">
                <AppLayout />
              </div>
            </MessageProvider>
          </AuthState>
  );
}

export default App;
