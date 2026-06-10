import { useState } from "react";
import "../../styles/login.css";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
function LoginPage() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await login(email, password);

    
    localStorage.setItem("token", response.token);
localStorage.setItem("email", response.email);
localStorage.setItem("role", response.role);
localStorage.setItem("name", response.name);

navigate("/dashboard");

  } catch (error) {
    console.error("Login Failed:", error);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>BIZ360 ERP</h1>
        <p>Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;