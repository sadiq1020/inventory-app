import React from "react";
import { Calendar, Clock, User, Clipboard, DollarSign, PlusCircle } from "lucide-react";

function TransactionTable() {
  // This is just placeholder data - in the future this will come from DynamoDB
  const dummyTransactions = [
    // { id: '1', customer: 'John Doe', date: '2025-04-25', time: '10:30 AM', amount: 250.00, type: 'Retail', items: 3 },
    // { id: '2', customer: 'Jane Smith', date: '2025-04-24', time: '3:15 PM', amount: 1250.50, type: 'Wholesale', items: 12 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {dummyTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${transaction.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'Retail' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;