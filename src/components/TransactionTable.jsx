// src/components/TransactionTable.jsx
import React, { useState } from "react";
import { Clipboard, PlusCircle } from "lucide-react";
import { useAuth } from "react-oidc-context";
import AddTransactionModal from "./AddTransactionModal"; // ✅ Import the modal

function TransactionTable() {
  const auth = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dummyTransactions = []; // Placeholder

  const handleNewTransactionClick = () => {
    if (!auth.isAuthenticated) {
      auth.signinRedirect(); // Redirect to Cognito login
    } else {
      setIsModalOpen(true); // ✅ Open the modal
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {dummyTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          {/* You can place the real transaction table here */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12">
          <div className="mb-4 p-4 bg-gray-100 rounded-full">
            <Clipboard className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new transaction.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleNewTransactionClick}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
              New Transaction
            </button>
          </div>
        </div>
      )}

      {/* ✅ Modal Integration */}
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default TransactionTable;
