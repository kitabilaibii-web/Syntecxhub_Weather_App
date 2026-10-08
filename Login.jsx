import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fake authentication check
    if (username === "student" && password === "react123") {
      // Save login status in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);

      setError("");
      navigate("/dashboard");
    } else {
      setError("Invalid username or password. Try again!");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>🌤️ Smart Weather Dashboard</h2>
        <p className="subtitle">Please login to continue</p>

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit">Login</button>

        <p className="hint">
          Hint: username = <b>student</b>, password = <b>react123</b>
        </p>
      </form>
    </div>
  );
}

export default Login;
