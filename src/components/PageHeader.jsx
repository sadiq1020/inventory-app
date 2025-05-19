// src/components/PageHeader.jsx
import React from "react";
import { useAuth } from "react-oidc-context";
import { ShoppingBag, Package, LogOut, User, List } from "lucide-react";

function PageHeader({ title, onAllClick, onRetailClick, onWholesaleClick }) {
    const auth = useAuth();

    const handleLogout = () => {
        auth.signoutRedirect();
    };

    const handleLogin = () => {
        auth.signinRedirect();
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
                            className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-white hover:shadow-sm transition"
                        >
                            <List size={16} className="inline mr-1" />
                            All
                        </button>

                        <button
                            onClick={onRetailClick}
                            className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-white hover:shadow-sm transition"
                        >
                            <ShoppingBag size={16} className="inline mr-1" />
                            Retail
                        </button>

                        <button
                            onClick={onWholesaleClick}
                            className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-white hover:shadow-sm transition"
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