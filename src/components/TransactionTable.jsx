// src/components/TransactionTable.jsx
import React, { useState, useEffect } from "react";
import { Clipboard, PlusCircle, ChevronDown, Filter, Search, Download } from "lucide-react";
import { useAuth } from "react-oidc-context";
import AddTransactionModal from "./AddTransactionModal";
import { fetchRetailTransactions, fetchWholesaleTransactions, fetchCustomerDetails } from "../api/fetchTransactions";
import { format } from "date-fns";

function TransactionTable({ initialTransactionType }) {
  const auth = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retailTransactions, setRetailTransactions] = useState([]);
  const [wholesaleTransactions, setWholesaleTransactions] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [transactionType, setTransactionType] = useState(initialTransactionType || "all"); // "all", "retail", or "wholesale"
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data when component mounts or auth state changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchData();
    }
  }, [auth.isAuthenticated]);

  // Update transaction type when initialTransactionType prop changes
  useEffect(() => {
    if (initialTransactionType) {
      setTransactionType(initialTransactionType);
    }
  }, [initialTransactionType]);

  const fetchData = async () => {
    if (!auth.isAuthenticated) return;

    setIsLoading(true);
    try {
      const idToken = auth.user?.id_token || auth.user?.access_token;

      // Fetch transactions in parallel
      const [retailData, wholesaleData] = await Promise.all([
        fetchRetailTransactions(idToken),
        fetchWholesaleTransactions(idToken)
      ]);

      setRetailTransactions(retailData);
      setWholesaleTransactions(wholesaleData);

      // Get all unique customer IDs
      const allCustomerIds = [
        ...retailData.map(item => item.CustomerID),
        ...wholesaleData.map(item => item.CustomerID)
      ];

      // Fetch customer details
      const customers = await fetchCustomerDetails(idToken, allCustomerIds);
      setCustomerDetails(customers);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      // Handle the error appropriately - maybe show a toast or error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTransactionClick = () => {
    if (!auth.isAuthenticated) {
      auth.signinRedirect(); // Redirect to Cognito login
    } else {
      setIsModalOpen(true);
    }
  };

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
  };

  // Helper function to filter transactions based on search term
  const filterTransactions = (transactions) => {
    if (!searchTerm) return transactions;

    return transactions.filter(transaction => {
      const customer = customerDetails[transaction.CustomerID];
      if (!customer) return false;

      const customerName = customer.Name || "";
      const customerPhone = customer.PhoneNumber || "";
      const customerId = transaction.CustomerID || "";
      const transactionId = transaction.TransactionID || "";

      const searchTermLower = searchTerm.toLowerCase();

      return (
        customerName.toLowerCase().includes(searchTermLower) ||
        customerPhone.includes(searchTerm) ||
        customerId.toLowerCase().includes(searchTermLower) ||
        transactionId.toLowerCase().includes(searchTermLower)
      );
    });
  };

  // Combine and process transactions based on filter
  const getFilteredTransactions = () => {
    let filteredTransactions = [];

    if (transactionType === "all" || transactionType === "retail") {
      const processedRetail = retailTransactions.map(tx => ({
        ...tx,
        type: "retail",
        quantity: tx.Quantity_Pcs,
        sellingPrice: tx.SellingPrice_Per_Pc,
        cogs: tx.COGS_Per_Pc
      }));
      filteredTransactions = [...filteredTransactions, ...processedRetail];
    }

    if (transactionType === "all" || transactionType === "wholesale") {
      const processedWholesale = wholesaleTransactions.map(tx => ({
        ...tx,
        type: "wholesale",
        quantity: tx.Quantity_Packets,
        sellingPrice: tx.SellingPrice_Per_Packet,
        cogs: tx.COGS_Per_Packet
      }));
      filteredTransactions = [...filteredTransactions, ...processedWholesale];
    }

    // Apply search filtering
    filteredTransactions = filterTransactions(filteredTransactions);

    // Sort by date, newest first
    return filteredTransactions.sort((a, b) => {
      return new Date(b.Date) - new Date(a.Date);
    });
  };

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Get all filtered transactions
  const allFilteredTransactions = getFilteredTransactions();

  // Calculate statistics
  const totalTransactions = allFilteredTransactions.length;
  const totalProfit = allFilteredTransactions.reduce(
    (sum, tx) => sum + parseFloat(tx.NetProfit || 0),
    0
  ).toFixed(2);

  // Calculate pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const displayTransactions = allFilteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Calculate total pages
  const totalPages = Math.ceil(allFilteredTransactions.length / transactionsPerPage);

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Format time helper
  const formatTime = (timeString) => {
    if (!timeString) return "-";

    // Check if the time is already in a specific format (like the "21:26:26" format seen in the screenshot)
    if (typeof timeString === 'string' && timeString.includes(':')) {
      return timeString;
    }

    try {
      // If it's a Date object or timestamp, format it
      return format(new Date(timeString), "HH:mm:ss");
    } catch (e) {
      return timeString;
    }
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "-";
    return parseFloat(amount).toFixed(2);
  };

  // Handle refresh data
  const handleRefresh = () => {
    fetchData();
  };

  // After adding a transaction, refresh data
  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchData(); // Refresh data when modal closes
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Transaction Filters and Controls */}
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTransactionTypeChange("all")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${transactionType === "all"
              ? "bg-blue-100 text-blue-800"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => handleTransactionTypeChange("retail")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${transactionType === "retail"
              ? "bg-blue-100 text-blue-800"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Retail
          </button>
          <button
            onClick={() => handleTransactionTypeChange("wholesale")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${transactionType === "wholesale"
              ? "bg-blue-100 text-blue-800"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Wholesale
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
            title="Refresh data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={handleNewTransactionClick}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <PlusCircle size={16} className="mr-1" />
            <span>New</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <span className="mt-2 text-gray-500">Loading transactions...</span>
          </div>
        </div>
      ) : displayTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile Number
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variation
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selling Price
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  COGS
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Profit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayTransactions.map((transaction) => {
                const customer = customerDetails[transaction.CustomerID] || {};
                return (
                  <tr key={transaction.TransactionID} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.Date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(transaction.Time)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.Name || "Unknown"}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {customer.PhoneNumber || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${transaction.type === "retail"
                        ? "bg-green-100 text-green-800"
                        : "bg-indigo-100 text-indigo-800"
                        }`}>
                        {transaction.type === "retail" ? "Retail" : "Wholesale"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.ProductName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.ProductVariation}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(transaction.sellingPrice)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(transaction.cogs)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(transaction.NetProfit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12">
          <div className="mb-4 p-4 bg-gray-100 rounded-full">
            <Clipboard className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms or filters."
              : "Get started by creating a new transaction."}
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

      {/* Pagination and Statistics */}
      {displayTransactions.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstTransaction + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastTransaction, totalTransactions)}
                </span>{" "}
                of <span className="font-medium">{totalTransactions}</span> transactions
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Total Profit: <span className="font-medium text-green-600">${totalProfit}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>

                {/* Pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, array) => {
                    // If there's a gap, show ellipsis
                    if (index > 0 && page > array[index - 1] + 1) {
                      return (
                        <span
                          key={`ellipsis-${page}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Modal Integration */}
      <AddTransactionModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}

export default TransactionTable;