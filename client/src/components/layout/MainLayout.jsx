import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
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
    </div>
  );
}

export default MainLayout;