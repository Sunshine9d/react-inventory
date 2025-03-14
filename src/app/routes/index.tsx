import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import MainLayout from "@layouts/MainLayout";
import AuthLayout from "@layouts/AuthLayout";

// Lazy-loaded pages (for better performance)
const Dashboard = lazy(() => import("@pages/dashboard/Dashboard"));
const InventoryList = lazy(() => import("@pages/inventory/InventoryList"));
const OrderList = lazy(() => import("@pages/orders/OrderList"));
const Login = lazy(() => import("@pages/auth/Login"));
const Register = lazy(() => import("@pages/auth/Register"));
const NotFound = lazy(() => import("@pages/shared/NotFound"))
const ProductList = lazy(() => import("@pages/products/ProductList"))

const AppRoutes = () => {
    return (
        <Router>
            <Suspense fallback={<div className="text-center">Loading...</div>}>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Protected Routes (Requires Auth) */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route
                                path="/inventory"
                                element={<InventoryList />}
                            />
                            <Route path="/orders" element={<OrderList />} />
                            <Route path="/products" element={<ProductList />} />
                        </Route>
                    </Route>

                    {/* 404 Page */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;
