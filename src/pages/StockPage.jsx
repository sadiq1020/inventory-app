// src/pages/StockPage.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { LogOut, Plus, Search, Filter, ArrowUpDown, Download, MoreVertical, Edit, Trash, Package, AlertCircle } from "lucide-react";

function StockPage() {
    const [activeTab, setActiveTab] = useState("retail"); // "retail" or "wholesale"
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "itemType",
        direction: "ascending"
    });
    const [showLowStock, setShowLowStock] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(null);

    // This would be replaced with real data from DynamoDB in the future
    const dummyRetailStock = [
        { id: "r1", itemType: "Non-judicial stamp", variationName: "100-90", quantity: 10, lowStockThreshold: 20, unitPrice: 90 },
        { id: "r2", itemType: "Cartridge Paper", variationName: "10-6", quantity: 200, lowStockThreshold: 50, unitPrice: 6 },
        { id: "r3", itemType: "Legal Pad", variationName: "Standard", quantity: 75, lowStockThreshold: 25, unitPrice: 12 },
        { id: "r4", itemType: "Parchment Paper", variationName: "Premium", quantity: 35, lowStockThreshold: 15, unitPrice: 18 },
    ];

    const dummyWholesaleStock = [
        { id: "w1", itemType: "Folio Paper", variationName: "10-6", quantity: 5, lowStockThreshold: 10, unitPrice: 60 },
        { id: "w2", itemType: "Non-judicial stamp", variationName: "50-46", quantity: 30, lowStockThreshold: 15, unitPrice: 46 },
        { id: "w3", itemType: "Binding Covers", variationName: "Clear", quantity: 120, lowStockThreshold: 50, unitPrice: 35 },
        { id: "w4", itemType: "Envelope Pack", variationName: "Business", quantity: 8, lowStockThreshold: 15, unitPrice: 120 },
    ];

    const currentStock = activeTab === "retail" ? dummyRetailStock : dummyWholesaleStock;

    // Handle searching
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle sorting
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Apply sorting and filtering
    const filteredAndSortedStock = currentStock
        .filter(item => {
            // Apply search filter
            const matchesSearch =
                item.itemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.variationName.toLowerCase().includes(searchQuery.toLowerCase());

            // Apply low stock filter if enabled
            const matchesLowStock = !showLowStock || item.quantity <= item.lowStockThreshold;

            return matchesSearch && matchesLowStock;
        })
        .sort((a, b) => {
            // Apply sorting
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

    // Handle actions menu toggle
    const toggleActionsMenu = (itemId) => {
        setShowActionsMenu(showActionsMenu === itemId ? null : itemId);
    };

    // Mock actions that would connect to real functionality later
    const handleEditItem = (itemId) => {
        console.log(`Edit item: ${itemId}`);
        setShowActionsMenu(null);
    };

    const handleDeleteItem = (itemId) => {
        console.log(`Delete item: ${itemId}`);
        setShowActionsMenu(null);
    };

    const handleExportData = () => {
        console.log("Exporting stock data...");
        // This would be implemented to export data to CSV or similar format
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header with Logout */}
                <header className="sticky top-0 z-10 bg-white border-b px-6 py-4 shadow-sm">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">Stock Management</h1>

                        <button className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                            <LogOut size={16} className="mr-2" />
                            <span>Log out</span>
                        </button>
                    </div>
                </header>

                <main className="p-6 max-w-7xl mx-auto">
                    {/* Tabs & Actions Section */}
                    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Tab Toggles */}
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => setActiveTab("retail")}
                                    className={`px-4 py-2 rounded-md transition-colors ${activeTab === "retail"
                                            ? "bg-blue-100 text-blue-700 font-medium"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    Retail Stock
                                </button>
                                <button
                                    onClick={() => setActiveTab("wholesale")}
                                    className={`px-4 py-2 rounded-md transition-colors ${activeTab === "wholesale"
                                            ? "bg-green-100 text-green-700 font-medium"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    Wholesale Stock
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Search size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search items..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <button
                                    onClick={() => setShowLowStock(!showLowStock)}
                                    className={`flex items-center px-3 py-2 rounded-md border ${showLowStock
                                            ? "bg-amber-50 border-amber-200 text-amber-700"
                                            : "border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <AlertCircle size={16} className="mr-1" />
                                    <span>Low Stock</span>
                                </button>

                                <button
                                    onClick={handleExportData}
                                    className="flex items-center px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                                >
                                    <Download size={16} className="mr-1" />
                                    <span>Export</span>
                                </button>

                                <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                    <Plus size={16} className="mr-1" />
                                    <span>Add Item</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stock Table */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className={activeTab === "retail" ? "bg-blue-50" : "bg-green-50"}>
                                    <tr>
                                        {[
                                            { key: "itemType", label: "Item Type" },
                                            { key: "variationName", label: "Variation" },
                                            { key: "quantity", label: "Quantity" },
                                            { key: "unitPrice", label: "Unit Price" },
                                            { key: null, label: "Actions" }
                                        ].map((column) => (
                                            <th
                                                key={column.key || "actions"}
                                                scope="col"
                                                className={`px-6 py-3 text-left text-xs font-medium tracking-wider ${activeTab === "retail" ? "text-blue-700" : "text-green-700"
                                                    }`}
                                            >
                                                {column.key ? (
                                                    <button
                                                        onClick={() => requestSort(column.key)}
                                                        className="flex items-center group"
                                                    >
                                                        {column.label}
                                                        <ArrowUpDown
                                                            size={14}
                                                            className={`ml-1 ${sortConfig.key === column.key
                                                                    ? "opacity-100"
                                                                    : "opacity-0 group-hover:opacity-50"
                                                                }`}
                                                        />
                                                    </button>
                                                ) : (
                                                    column.label
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAndSortedStock.length > 0 ? (
                                        filteredAndSortedStock.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <Package size={16} className="text-gray-500" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{item.itemType}</div>
                                                            <div className="text-xs text-gray-500">ID: {item.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{item.variationName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <span className={`${item.quantity <= item.lowStockThreshold
                                                                ? "text-red-600 font-medium"
                                                                : "text-gray-900"
                                                            }`}>
                                                            {item.quantity}
                                                        </span>
                                                        {item.quantity <= item.lowStockThreshold && (
                                                            <AlertCircle size={16} className="ml-1 text-red-500" />
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {activeTab === "retail" ? "Pieces" : "Packets"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">${item.unitPrice.toFixed(2)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                                    <button
                                                        onClick={() => toggleActionsMenu(item.id)}
                                                        className="text-gray-400 hover:text-gray-500 p-1 rounded hover:bg-gray-100"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>

                                                    {showActionsMenu === item.id && (
                                                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                            <div className="py-1" role="menu" aria-orientation="vertical">
                                                                <button
                                                                    onClick={() => handleEditItem(item.id)}
                                                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    <Edit size={16} className="mr-2 text-gray-500" />
                                                                    Edit Item
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteItem(item.id)}
                                                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                >
                                                                    <Trash size={16} className="mr-2" />
                                                                    Delete Item
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <Package size={48} className="text-gray-300 mb-2" />
                                                    <h3 className="text-sm font-medium text-gray-900 mb-1">No items found</h3>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        {searchQuery
                                                            ? "Try changing your search query or filters"
                                                            : "Get started by adding your first item"}
                                                    </p>
                                                    <button
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        <Plus size={16} className="mr-1" />
                                                        Add New Item
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default StockPage;