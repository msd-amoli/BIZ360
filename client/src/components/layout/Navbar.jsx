import { useNavigate } from "react-router-dom";
import logo from "../../assets/logog.png"
function Navbar() {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const role = localStorage.getItem("role");
  
const handleLogout= () =>{
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('role');
  navigate('/');
}

  return (
    <header className="navbar">
      <div className="logodiv">
      <img src={logo} width={100}/>
      <h2>BIZ<sup>o</sup> ERP</h2>
</div>
      <div className="user">
    <div>
  <div>{email}</div>
  <div>{role}</div>
</div>
  <button onClick={handleLogout} className="logout">
    Logout
  </button>
</div>
    </header>
  );
}

export default Navbar;