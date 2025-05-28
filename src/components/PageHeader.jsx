// src/components/PageHeader.jsx
import React from "react";
import { useAuth } from "react-oidc-context";
import { ShoppingBag, Package, LogOut, User, List } from "lucide-react";
// import CognitoService from "../auth/CognitoService";

function PageHeader({ title, onAllClick, onRetailClick, onWholesaleClick }) {
    const auth = useAuth();

    // const handleLogout = () => {
    //     // Clear local auth state manually (optional)
    //     auth.removeUser();
    //     // auth.signoutRedirect();
    //     localStorage.clear();

    //     // Then force full logout via Hosted UI
    //     window.location.href = "https://us-east-1szdqpwkvh.auth.us-east-1.amazoncognito.com/logout?client_id=15blsvpjgpi9c2v4h38amrg3tb&logout_uri=http://localhost:5173/&federated";
    // };

    const handleLogout = () => {
        auth.removeUser();
        localStorage.clear();
        sessionStorage.clear();

        const region = import.meta.env.VITE_COGNITO_REGION;
        const domain = import.meta.env.VITE_COGNITO_DOMAIN;
        const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
        const logoutUri = import.meta.env.VITE_LOGOUT_URI;

        const logoutUrl = `https://${domain}.auth.${region}.amazoncognito.com/logout?client_id=${clientId}&logout_uri=${logoutUri}&federated`;
        window.location.href = logoutUrl;
    };



    // const handleLogin = () => {
    //     // Use signinRedirect with minimal parameters to use the defaults from config
    //     auth.signinRedirect().catch(error => {
    //         console.error("Login error:", error);
    //     });
    // };

    const handleLogin = async () => {
        if (auth.isLoading) return; // Prevent triggering while already loading

        try {
            await auth.signinRedirect();
        } catch (error) {
            console.error("Login error:", error);
            // Optional: Show an error toast/alert here if you want
        }
    };

    // Function to determine if button should appear active
    const getButtonClass = (isActive) => {
        return `px-4 py-2 text-sm font-medium rounded-md transition ${isActive
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-700 hover:bg-white hover:shadow-sm"
            }`;
    };

    return (
        <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

                <div className="flex items-center space-x-6">
                    {/* Transaction Type Tabs */}
                    <div className="hidden md:flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={onAllClick}
                            className={getButtonClass(title === "All Transactions")}
                        >
                            <List size={16} className="inline mr-1" />
                            All
                        </button>

                        <button
                            onClick={onRetailClick}
                            className={getButtonClass(title === "Retail Transactions")}
                        >
                            <ShoppingBag size={16} className="inline mr-1" />
                            Retail
                        </button>

                        <button
                            onClick={onWholesaleClick}
                            className={getButtonClass(title === "Wholesale Transactions")}
                        >
                            <Package size={16} className="inline mr-1" />
                            Wholesale
                        </button>
                    </div>

                    {/* User Account & Auth */}
                    {auth.isAuthenticated ? (
                        <div className="flex items-center space-x-2">
                            <div className="hidden md:block text-right">
                                <div className="text-sm font-medium text-gray-900">
                                    {auth.user?.profile?.email || "User"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {auth.user?.profile?.["cognito:groups"]?.includes("Admin") ? "Admin" : "User"}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="ml-2 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full"
                                title="Sign out"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            <User size={16} className="mr-1" />
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default PageHeader;