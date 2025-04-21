// src/components/TransactionActions.jsx
import React from "react";

function TransactionActions() {
  return (
    <div className="flex justify-center gap-6 mt-6">
      <button className="px-6 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600">
        Add Transaction
      </button>
      <button className="px-6 py-2 border rounded bg-yellow-500 text-white hover:bg-yellow-600">
        Modify Transaction
      </button>
      <button className="px-6 py-2 border rounded bg-red-500 text-white hover:bg-red-600">
        Delete Transaction
      </button>
    </div>
  );
}

export default TransactionActions;
