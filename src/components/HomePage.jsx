import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import TransactionTable from "../components/TransactionTable";
import TransactionActions from "../components/TransactionActions";

function HomePage() {
  const [searchBy, setSearchBy] = useState("name"); // Default "Search by Name"
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
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 overflow-auto">
        <PageHeader
          title="Transaction History"
          onRetailClick={handleRetailClick}
          onWholesaleClick={handleWholesaleClick}
        />

        {/* Main Content */}
        <main className="p-6 flex flex-col gap-6">

          {/* Search Section */}
          <div className="flex justify-center items-center">
            <div className="flex border border-black rounded overflow-hidden w-1/2">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="p-2 bg-white text-gray-700 focus:outline-none border-r border-black"
              >
                <option value="name">Search by Name</option>
                <option value="mobile">Search by Mobile Number</option>
                <option value="customerId">Search by Customer ID</option>
              </select>

              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="flex-1 p-2 focus:outline-none"
              />
            </div>
          </div>


          {/* Transaction Table */}
          <h2 className="text-center text-2xl font-semibold">Transaction History</h2>
          <TransactionTable />

          {/* Actions */}
          <TransactionActions />
        </main>
      </div>
    </div>
  );
}

export default HomePage;
