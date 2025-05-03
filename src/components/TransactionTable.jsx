// src/components/TransactionTable.jsx
import React from "react";
import { Clipboard, PlusCircle } from "lucide-react";
import { useAuth } from "react-oidc-context";

function TransactionTable() {
  const auth = useAuth();

  const dummyTransactions = []; // Placeholder

  const handleNewTransactionClick = () => {
    if (!auth.isAuthenticated) {
      auth.signinRedirect(); // Redirect to Cognito login
    } else {
      console.log("Open modal or route to transaction form");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {dummyTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          {/* Your table implementation here */}
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
    </div>
  );
}

export default TransactionTable;
