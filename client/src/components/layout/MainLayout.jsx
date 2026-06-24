import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AiAssistant from "../../pages/ai-assistant/AiAssistant"
import "../../styles/layout.css";

function MainLayout() {
  return (
    <div className="layout">
      <Navbar />

      <div className="layout-body">
        <Sidebar />

        <main className="content">
          <Outlet />
        </main>
      </div>

      <AiAssistant />
    </div>
  );
}

export default MainLayout;