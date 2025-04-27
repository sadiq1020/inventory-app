// src/components/PageHeader.jsx
import React from "react";

function PageHeader({ title, onRetailClick, onWholesaleClick }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">{title}</h2>
                <button
                    onClick={onRetailClick}
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                >
                    Retail
                </button>
                <button
                    onClick={onWholesaleClick}
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                >
                    Wholesale
                </button>
            </div>

            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Log out
            </button>
        </div>
    );
}

export default PageHeader;
