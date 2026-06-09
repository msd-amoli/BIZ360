import { useNavigate } from "react-router-dom";
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
      <h2>BIZ360 ERP</h2>

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