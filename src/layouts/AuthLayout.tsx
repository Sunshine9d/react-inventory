import { Outlet } from "react-router-dom";

function AuthLayout() {
    console.log("AuthLayout");

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <Outlet />
        </div>
    );
}

export default AuthLayout;
