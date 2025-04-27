// src/pages/CustomerPage.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
// import CustomerTable from "../components/CustomerTable";

function CustomerList() {

    const handleRetailClick = () => {
        console.log("Retail clicked (CustomerPage)");
    };

    const handleWholesaleClick = () => {
        console.log("Wholesale clicked (CustomerPage)");
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-auto">
                <PageHeader
                    title="Customers List"
                    onRetailClick={handleRetailClick}
                    onWholesaleClick={handleWholesaleClick}
                />

                {/* Main Section */}
                <main className="p-6 flex flex-col gap-6">
                    <h2 className="text-2xl font-semibold text-center mb-4">Customers List</h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg shadow">
                            <thead className="bg-gray-100">
                                <tr>
                                    {['Customer ID', 'Name', 'Address', 'Customer Type', 'Email', 'Phone Number'].map((heading) => (
                                        <th
                                            key={heading}
                                            className="px-6 py-3 text-left text-sm font-medium text-gray-600"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {/* You’ll fetch and map customers here in the future */}
                                <tr className="text-sm text-gray-700 text-center">
                                    <td className="px-6 py-4">—</td>
                                    <td className="px-6 py-4">—</td>
                                    <td className="px-6 py-4">—</td>
                                    <td className="px-6 py-4">—</td>
                                    <td className="px-6 py-4">—</td>
                                    <td className="px-6 py-4">—</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Add New Customer Button */}
                    <div className="text-center">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition shadow">
                            Add New Customer
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CustomerList;
