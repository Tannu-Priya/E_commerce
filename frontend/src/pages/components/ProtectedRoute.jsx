import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAuthenticated = !!user && !!user.token;

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin route check
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/products" replace />;
  }

  return children;
}

export default ProtectedRoute;
