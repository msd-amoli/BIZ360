
import { Link } from "react-router-dom";
function LoginPage(){
    return (
        <div>
            <h1>Login page</h1>

            <Link to={"/dashboard"}>
                Go To dashboard
            </Link>
        </div>
    );
}
export default LoginPage;