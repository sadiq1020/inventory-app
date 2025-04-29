import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import TransactionTable from "../components/TransactionTable";
import TransactionActions from "../components/TransactionActions";
import { Search } from "lucide-react";

function HomePage() {
  const [searchBy, setSearchBy] = useState("name");
  const [searchInput, setSearchInput] = useState("");

  const handleRetailClick = () => {
    console.log("Retail clicked (HomePage)");
  };

  const handleWholesaleClick = () => {
    console.log("Wholesale clicked (HomePage)");
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;

    if (searchBy === "mobile") {
      // Only allow numbers
      if (/^\d*$/.test(value)) {
        setSearchInput(value);
      }
    } else if (searchBy === "name") {
      // Only allow letters and spaces
      if (/^[A-Za-z\s]*$/.test(value)) {
        setSearchInput(value);
      }
    } else {
      // For CustomerID: Allow anything
      setSearchInput(value);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <PageHeader
          title="Transaction History"
          onRetailClick={handleRetailClick}
          onWholesaleClick={handleWholesaleClick}
        />

        {/* Main Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {/* Search Section */}
          <div className="mb-8">
            <div className="flex items-center max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-400">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="px-4 py-3 text-gray-700 focus:outline-none border-r bg-gray-50"
              >
                <option value="name">Name</option>
                <option value="mobile">Mobile</option>
                <option value="customerId">Customer ID</option>
              </select>

              <input
                type="text"
                placeholder="Search transactions..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="flex-1 px-4 py-3 focus:outline-none"
              />

              <button className="px-4 py-3 bg-white text-gray-500 hover:text-blue-600">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Transaction History</h2>
            <TransactionTable />
          </div>

          {/* Actions */}
          <TransactionActions />
        </main>
      </div>
    </div>
  );
}

export default HomePage;