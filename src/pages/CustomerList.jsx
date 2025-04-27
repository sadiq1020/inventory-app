// src/pages/CustomerList.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import AddCustomerModal from "../components/AddCustomerModal";

function CustomerList() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRetailClick = () => {
        console.log("Retail clicked (CustomerPage)");
    };

    const handleWholesaleClick = () => {
        console.log("Wholesale clicked (CustomerPage)");
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <PageHeader
                    title="Customers List"
                    onRetailClick={handleRetailClick}
                    onWholesaleClick={handleWholesaleClick}
                />

                <main className="p-6 flex flex-col gap-6">
                    <h2 className="text-2xl font-semibold text-center mb-4">Customers List</h2>

                    <div className="overflow-x-auto">
                        {/* Your table (placeholder) */}
                        <table className="min-w-full bg-white border rounded-lg shadow">
                            <thead className="bg-gray-100">
                                <tr>
                                    {["Customer ID", "Name", "Address", "Customer Type", "Email", "Phone Number"].map((heading) => (
                                        <th key={heading} className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
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
                        <button
                            onClick={openModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
                        >
                            Add New Customer
                        </button>
                    </div>

                    {/* Modal */}
                    <AddCustomerModal isOpen={isModalOpen} onClose={closeModal} />
                </main>
            </div>
        </div>
    );
}

export default CustomerList;
