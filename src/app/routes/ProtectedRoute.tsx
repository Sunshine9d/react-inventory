import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
    // Replace with actual authentication logic
    return localStorage.getItem("token") !== null;
};

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
