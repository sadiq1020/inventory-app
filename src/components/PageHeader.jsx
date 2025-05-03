import React from "react";
import { LogOut, Filter, LogIn, User } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";

function PageHeader({ title, onRetailClick, onWholesaleClick }) {
    const auth = useAuth();

    console.log(auth);

    // Get user information from the auth context
    const getUserInfo = () => {
        if (!auth.user) return null;

        // Try to get the user's name (given_name or name) first, then fall back to email
        const name = auth.user?.profile?.given_name || auth.user?.profile?.name;
        const email = auth.user?.profile?.email;

        // Return name if available, otherwise email, or "User" as a last resort
        return name || email || "User";
    };

    const handleLogout = () => {
        // First clear the local session
        auth.removeUser();

        // Then redirect to Cognito's logout endpoint with the correct domain format
        const clientId = "15blsvpjgpi9c2v4h38amrg3tb";
        const logoutUri = encodeURIComponent("http://localhost:5173");

        // The correct format based on your browser URL from the screenshot
        window.location.href = `https://us-east-1szdqpwkvh.auth.us-east-1.amazoncognito.com/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
    };

    return (
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={onRetailClick}
                            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-white hover:shadow-sm transition-all"
                            title="Filter by Retail"
                        >
                            <Filter size={16} className="mr-2" />
                            <span>Retail</span>
                        </button>
                        <button
                            onClick={onWholesaleClick}
                            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-white hover:shadow-sm transition-all"
                            title="Filter by Wholesale"
                        >
                            <Filter size={16} className="mr-2" />
                            <span>Wholesale</span>
                        </button>
                    </div>

                    {auth.isAuthenticated ? (
                        <div className="flex items-center">
                            {/* User info display */}
                            <div className="flex items-center mr-4 px-3 py-2 bg-gray-100 text-gray-700 rounded-md">
                                <User size={16} className="mr-2 text-gray-500" />
                                <span className="font-medium">{getUserInfo()}</span>
                            </div>

                            {/* Logout button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                <LogOut size={16} className="mr-2" />
                                <span>Log out</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => auth.signinRedirect()}
                            className="ml-4 flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <LogIn size={16} className="mr-2" />
                            <span>Sign in</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PageHeader;