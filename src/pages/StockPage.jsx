// src/pages/StockPage.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";

function StockPage() {

    const dummyRetailStock = [
        { itemType: "Non-judicial stamp", variationName: "100-90", quantity: 100 },
        { itemType: "Cartridge Paper", variationName: "10-6", quantity: 200 },
        // add more later
    ];

    const dummyWholesaleStock = [
        { itemType: "Folio Paper", variationName: "10-6", quantity: 50 },
        { itemType: "Non-judicial stamp", variationName: "50-46", quantity: 30 },
        // add more later
    ];

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Stock Management</h2>

                    {/* Only Log Out Button */}
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Log out
                    </button>
                </div>

                {/* Retail Stock Table */}
                <section className="mb-10 flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-4">Retail Stock</h3>
                    <div className="overflow-x-auto bg-white rounded-lg shadow p-4 w-full max-w-5xl">
                        <table className="w-full table-auto">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">Item Type</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">Variation Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">Quantity (Pcs)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dummyRetailStock.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{item.itemType}</td>
                                        <td className="px-6 py-4">{item.variationName}</td>
                                        <td className="px-6 py-4">{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Wholesale Stock Table */}
                <section className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-4">Wholesale Stock</h3>
                    <div className="overflow-x-auto bg-white rounded-lg shadow p-4 w-full max-w-5xl">
                        <table className="w-full table-auto">
                            <thead className="bg-green-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-700">Item Type</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-700">Variation Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-700">Quantity (Packets)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dummyWholesaleStock.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{item.itemType}</td>
                                        <td className="px-6 py-4">{item.variationName}</td>
                                        <td className="px-6 py-4">{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default StockPage;
