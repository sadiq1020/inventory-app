// src/pages/CustomerList.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import AddCustomerModal from "../components/AddCustomerModal";
import { Plus, Search, Filter, User, Mail, Phone, Edit, Trash, UserPlus } from "lucide-react";

function CustomerList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all"); // "all", "retail", "wholesale"
    const [searchQuery, setSearchQuery] = useState("");

    // This would be replaced with real data from DynamoDB in the future
    const [customers, setCustomers] = useState([
        // Sample data - can be removed when implementing DynamoDB
        /*
        {
            CustomerID: "cust-001",
            Name: "John Doe",
            Address: "123 Main St, Anytown",
            CustomerType: "Retail",
            Email: "john.doe@example.com",
            PhoneNumber: "555-123-4567"
        },
        {
            CustomerID: "cust-002",
            Name: "Jane Smith",
            Address: "456 Oak Ave, Business City",
            CustomerType: "Wholesale",
            Email: "jane.smith@company.com",
            PhoneNumber: "555-987-6543"
        }
        */
    ]);

    const handleRetailClick = () => {
        setActiveFilter("retail");
    };

    const handleWholesaleClick = () => {
        setActiveFilter("wholesale");
    };

    const handleResetFilter = () => {
        setActiveFilter("all");
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleEditCustomer = (customerId) => {
        // In the future, this would open the modal with customer data pre-filled
        console.log(`Edit customer with ID: ${customerId}`);
    };

    const handleDeleteCustomer = (customerId) => {
        // In the future, this would confirm and then delete from DynamoDB
        console.log(`Delete customer with ID: ${customerId}`);

        if (window.confirm("Are you sure you want to delete this customer?")) {
            // This will be replaced with a call to delete from DynamoDB
            setCustomers(customers.filter(customer => customer.CustomerID !== customerId));
        }
    };

    // Filter customers based on active filter and search query
    const filteredCustomers = customers.filter(customer => {
        // Type filter
        const matchesType =
            activeFilter === "all" ||
            (activeFilter === "retail" && customer.CustomerType === "Retail") ||
            (activeFilter === "wholesale" && customer.CustomerType === "Wholesale");

        // Search query filter
        const matchesSearch =
            customer.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.PhoneNumber.includes(searchQuery);

        return matchesType && matchesSearch;
    });

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <PageHeader
                    title="Customers"
                    onRetailClick={handleRetailClick}
                    onWholesaleClick={handleWholesaleClick}
                />

                <main className="p-6 max-w-7xl mx-auto">
                    {/* Filters and Search */}
                    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-2">
                                <h2 className="text-lg font-medium text-gray-700">Customer Database</h2>
                                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={handleResetFilter}
                                        className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-all ${activeFilter === "all"
                                                ? "bg-white shadow-sm text-blue-600"
                                                : "text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        <span>All</span>
                                    </button>
                                    <button
                                        onClick={handleRetailClick}
                                        className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-all ${activeFilter === "retail"
                                                ? "bg-white shadow-sm text-blue-600"
                                                : "text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        <Filter size={14} className="mr-1" />
                                        <span>Retail</span>
                                    </button>
                                    <button
                                        onClick={handleWholesaleClick}
                                        className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-all ${activeFilter === "wholesale"
                                                ? "bg-white shadow-sm text-blue-600"
                                                : "text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        <Filter size={14} className="mr-1" />
                                        <span>Wholesale</span>
                                    </button>
                                </div>
                            </div>

                            <div className="relative max-w-xs">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search size={16} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search customers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Customer Table */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[
                                            { id: "name", label: "Name" },
                                            { id: "type", label: "Type" },
                                            { id: "email", label: "Email" },
                                            { id: "phone", label: "Phone" },
                                            { id: "address", label: "Address" },
                                            { id: "actions", label: "Actions" }
                                        ].map((col) => (
                                            <th
                                                key={col.id}
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map((customer) => (
                                            <tr key={customer.CustomerID} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <User size={16} className="text-gray-500" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{customer.Name}</div>
                                                            <div className="text-xs text-gray-500">ID: {customer.CustomerID}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.CustomerType === 'Retail'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {customer.CustomerType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Mail size={14} className="mr-1 flex-shrink-0" />
                                                        <span className="truncate max-w-xs">{customer.Email || "—"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Phone size={14} className="mr-1 flex-shrink-0" />
                                                        {customer.PhoneNumber}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {customer.Address || "—"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleEditCustomer(customer.CustomerID)}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCustomer(customer.CustomerID)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <User size={48} className="text-gray-300 mb-2" />
                                                    <h3 className="text-sm font-medium text-gray-900 mb-1">No customers found</h3>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        {searchQuery
                                                            ? "Try changing your search query or filters"
                                                            : "Get started by adding your first customer"}
                                                    </p>
                                                    <button
                                                        onClick={openModal}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        <UserPlus size={16} className="mr-1" />
                                                        Add Customer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Floating Action Button for adding customers */}
                    <div className="fixed bottom-8 right-8">
                        <button
                            onClick={openModal}
                            className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            aria-label="Add new customer"
                        >
                            <Plus size={24} />
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