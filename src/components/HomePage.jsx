// src/components/HomePage.jsx
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import TransactionActions from "./TransactionActions";
import TransactionTable from "./TransactionTable";

function HomePage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

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
