// src/components/HomePage.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import TransactionTable from "../components/TransactionTable";
import TransactionActions from "../components/TransactionActions";

function HomePage() {

  const handleRetailClick = () => {
    console.log("Retail clicked (HomePage)");
    // TODO: Add filtering logic later
  };

  const handleWholesaleClick = () => {
    console.log("Wholesale clicked (HomePage)");
    // TODO: Add filtering logic later
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />



      <div className="flex-1 p-6 overflow-auto">

        <PageHeader
          title="Transaction History"
          onRetailClick={handleRetailClick}
          onWholesaleClick={handleWholesaleClick}
        />


        {/* Main Content */}
        {/* <div className="flex-1 flex flex-col">
        <Header /> */}

        {/* Search + Transaction History */}
        <main className="p-6 flex flex-col gap-6">
          <input
            type="text"
            placeholder="Search"
            className="w-1/2 mx-auto p-2 border rounded shadow"
          />

          <h2 className="text-center text-2xl font-semibold">
            Transaction History
          </h2>
          <TransactionTable />

          <TransactionActions />
        </main>
      </div>
    </div>
  );
}

export default HomePage;
