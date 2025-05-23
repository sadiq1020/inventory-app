// src/components/TransactionTable.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Clipboard, PlusCircle, ChevronDown, Search, Edit, Trash2 } from "lucide-react";
import { useAuth } from "react-oidc-context";
import AddTransactionModal from "./AddTransactionModal";
import DeleteConfirmModal from "../utils/DeleteConfirmModal";
import { fetchRetailTransactions, fetchWholesaleTransactions, fetchCustomerDetails } from "../api/fetchTransactions";
import { format } from "date-fns";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

function TransactionTable({ initialTransactionType }) {
  const auth = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [retailTransactions, setRetailTransactions] = useState([]);
  const [wholesaleTransactions, setWholesaleTransactions] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [transactionType, setTransactionType] = useState(initialTransactionType || "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // AWS Configuration
  const REGION = "us-east-1";
  const IDENTITY_POOL_ID = "us-east-1:e6bcc9cf-e0f5-4d5a-a530-1766da1767f9";

  // Create DynamoDB client with Cognito credentials
  const createDynamoDBClient = useCallback((idToken) => {
    return new DynamoDBClient({
      region: REGION,
      credentials: fromCognitoIdentityPool({
        identityPoolId: IDENTITY_POOL_ID,
        logins: {
          "cognito-idp.us-east-1.amazonaws.com/us-east-1_szDQpWkvh": idToken,
        },
      }),
    });
  }, []);

  // Fetch all transaction data
  const fetchData = useCallback(async () => {
    if (!auth.isAuthenticated) return;

    setIsLoading(true);
    try {
      const idToken = auth.user?.id_token || auth.user?.access_token;

      // Fetch transactions in parallel
      const [retailData, wholesaleData] = await Promise.all([
        fetchRetailTransactions(idToken),
        fetchWholesaleTransactions(idToken),
      ]);

      setRetailTransactions(retailData);
      setWholesaleTransactions(wholesaleData);

      // Get all unique customer IDs
      const allCustomerIds = [
        ...new Set([
          ...retailData.map(item => item.CustomerID),
          ...wholesaleData.map(item => item.CustomerID)
        ])
      ];

      // Fetch customer details
      const customers = await fetchCustomerDetails(idToken, allCustomerIds);
      setCustomerDetails(customers);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      // Consider adding user notification for fetch failure
    } finally {
      setIsLoading(false);
    }
  }, [auth.isAuthenticated, auth.user]);

  // Initial data load
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchData();
    }
  }, [auth.isAuthenticated, fetchData]);

  // Update transaction type when prop changes
  useEffect(() => {
    if (initialTransactionType) {
      setTransactionType(initialTransactionType);
    }
  }, [initialTransactionType]);

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "-";
    return parseFloat(amount).toFixed(2);
  };

  // Get filtered transactions based on current filters
  const getFilteredTransactions = useCallback(() => {
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
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filteredTransactions = filteredTransactions.filter(transaction => {
        const customer = customerDetails[transaction.CustomerID];
        if (!customer) return false;

        const customerName = customer.Name || "";
        const customerPhone = customer.PhoneNumber || "";
        const customerId = transaction.CustomerID || "";
        const transactionId = transaction.TransactionID || "";

        return (
          customerName.toLowerCase().includes(searchTermLower) ||
          customerPhone.includes(searchTerm) ||
          customerId.toLowerCase().includes(searchTermLower) ||
          transactionId.toLowerCase().includes(searchTermLower)
        );
      });
    }

    // Sort by date, newest first
    return filteredTransactions.sort((a, b) => {
      return new Date(b.Date) - new Date(a.Date);
    });
  }, [retailTransactions, wholesaleTransactions, transactionType, searchTerm, customerDetails]);

  // Handle edit transaction click
  const handleModifyTransactionClick = (transaction) => {
    // Prepare the transaction data for the modal
    const transactionForEdit = {
      ...transaction,
      // Ensure the transaction has all necessary fields for editing
      TransactionID: transaction.TransactionID,
      CustomerID: transaction.CustomerID,
      Date: transaction.Date,
      Time: transaction.Time,
      ProductName: transaction.ProductName,
      ProductVariation: transaction.ProductVariation,
      NetProfit: transaction.NetProfit,
      // Add type-specific fields
      ...(transaction.type === "retail" ? {
        quantity: transaction.Quantity_Pcs,
        sellingPrice: transaction.SellingPrice_Per_Pc,
        cogs: transaction.COGS_Per_Pc,
      } : {
        quantity: transaction.Quantity_Packets,
        sellingPrice: transaction.SellingPrice_Per_Packet,
        cogs: transaction.COGS_Per_Packet,
      })
    };

    setSelectedTransaction(transactionForEdit);
    setIsModifyModalOpen(true);
  };

  // Handle delete transaction click 
  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;

    setIsDeleting(true);
    try {
      const idToken = auth.user?.id_token || auth.user?.access_token;
      const client = createDynamoDBClient(idToken);

      // Determine which table to delete from based on transaction type
      const tableName = transactionToDelete.type === "retail"
        ? "Transaction_Retail"
        : "Transaction_Wholesale";

      // Delete the item from DynamoDB
      await client.send(new DeleteItemCommand({
        TableName: tableName,
        Key: {
          TransactionID: { S: transactionToDelete.TransactionID }
        },
      }));

      // Close modal and refresh data
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      // Consider adding user notification for delete failure
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle modal closures
  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchData();
  };

  const handleModifyModalClose = () => {
    setIsModifyModalOpen(false);
    setSelectedTransaction(null);
    fetchData();
  };

  // Handle various actions
  const handleRefresh = () => fetchData();
  const handleTransactionTypeChange = (type) => setTransactionType(type);
  const handleNewTransactionClick = () => {
    if (!auth.isAuthenticated) {
      auth.signinRedirect(); // Redirect to login if not authenticated
    } else {
      setIsModalOpen(true);
    }
  };

  // Authentication loading state
  if (auth.isLoading) {
    return (
      <div className="text-center text-gray-500 py-12">
        Loading authentication...
      </div>
    );
  }

  // Unauthenticated state
  if (!auth.isAuthenticated) {
    return (
      <div className="text-center text-gray-500 py-12">
        Please log in to see the transaction details.
      </div>
    );
  }

  // Check if user is admin
  const userGroups = auth.user?.profile?.["cognito:groups"] || [];
  const isAdmin = userGroups.includes("Admin");

  // Get transactions for display
  const allFilteredTransactions = getFilteredTransactions();
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const displayTransactions = allFilteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Calculate totals
  const totalTransactions = allFilteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
  const totalProfit = allFilteredTransactions.reduce(
    (sum, tx) => sum + parseFloat(tx.NetProfit || 0),
    0
  ).toFixed(2);

  // Render empty state
  const renderEmptyState = () => (
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
  );

  // Render loading state
  const renderLoading = () => (
    <div className="flex justify-center items-center p-12">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <span className="mt-2 text-gray-500">Loading transactions...</span>
      </div>
    </div>
  );

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
        renderLoading()
      ) : displayTransactions.length > 0 ? (
        <>
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
                  {isAdmin && (
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
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
                        {transaction.Time || "-"}
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
                      {isAdmin && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleModifyTransactionClick(transaction)}
                              className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 p-1 rounded"
                              title="Edit Transaction"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(transaction)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                              title="Delete Transaction"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination and Statistics */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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

                  {/* Current page / total pages */}
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    {currentPage} / {totalPages}
                  </span>

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

            {/* Mobile pagination */}
            <div className="flex sm:hidden justify-between w-full">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        renderEmptyState()
      )}

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />

      {/* Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isModifyModalOpen}
        onClose={handleModifyModalClose}
        transaction={selectedTransaction}
        customerDetails={customerDetails}
        isEdit={true}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete this ${transactionToDelete?.type || ''} transaction? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default TransactionTable;