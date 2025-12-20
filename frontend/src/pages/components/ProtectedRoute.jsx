
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = false; // later replace with real auth

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;



// import { Navigate } from "react-router-dom"
// import { useAuth } from "../context/AuthContext"

// function ProtectedRoute({ children, adminOnly = false }) {
//   const { isAuthenticated, user } = useAuth()

//   // not logged in
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />
//   }

//   // admin route check
//   if (adminOnly && user?.role !== "admin") {
//     return <Navigate to="/products" />
//   }

//   return children
// }

// export default ProtectedRoute
