import { Link } from "react-router-dom";

function DashboardPage(){

    return (
        <div>
            <h1>Dashboard page</h1>

            <Link to={"/"}>
            Back to Login
            </Link>
        </div>
    );
}

export default DashboardPage;