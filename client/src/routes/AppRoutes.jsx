
import {Routes, Route} from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboards/Dashboardpage";
function AppRoutes(){
    return(

        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path ="/dashboard" element={<DashboardPage/>}/>
        </Routes>

    );
}

export default AppRoutes;