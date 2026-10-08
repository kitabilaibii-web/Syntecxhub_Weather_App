import { Navigate } from "react-router-dom";

// Yeh component check karta hai ke user logged in hai ya nahi.
// Agar nahi, toh use /login par bhej deta hai (redirect).
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
