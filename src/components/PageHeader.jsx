import React from "react";
import { LogOut, Filter } from "lucide-react";

function PageHeader({ title, onRetailClick, onWholesaleClick }) {
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

                    <button className="ml-4 flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                        <LogOut size={16} className="mr-2" />
                        <span>Log out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PageHeader;