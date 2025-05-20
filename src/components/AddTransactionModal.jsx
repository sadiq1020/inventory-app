// src/components/ModifyTransactionModal.jsx
import React, { Fragment, useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Transition, TransitionChild } from "@headlessui/react";
import { X, Check, Search, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import { useAuth } from "react-oidc-context";
import {
    DynamoDBClient,
    PutItemCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";
import {
    fromCognitoIdentityPool,
} from "@aws-sdk/credential-provider-cognito-identity";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import "react-datepicker/dist/react-datepicker.css";

const REGION = "us-east-1";
const IDENTITY_POOL_ID = "us-east-1:e6bcc9cf-e0f5-4d5a-a530-1766da1767f9";
const CUSTOMERS_TABLE_NAME = "Customer_Information";
const RETAIL_TABLE_NAME = "Transaction_Retail";
const WHOLESALE_TABLE_NAME = "Transaction_Wholesale";

const nonJudicialVariations = [
    "100-90", "50-46", "40-35", "30-26", "25-21", "20-16", "10-8", "5-3"
];

function ModifyTransactionModal({ isOpen, onClose, transaction, customerDetails }) {
    const auth = useAuth();
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [productType, setProductType] = useState("Retail");
    const [productCategory, setProductCategory] = useState("Non-judicial stamp");
    const [productVariation, setProductVariation] = useState("");
    const [quantity, setQuantity] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [cogs, setCogs] = useState("");
    const [netProfit, setNetProfit] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Customer search and selection
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerId, setCustomerId] = useState("");

    // Initialize form with transaction data
    useEffect(() => {
        if (transaction && isOpen) {
            // Set product type
            setProductType(transaction.type === "retail" ? "Retail" : "Wholesale");

            // Set product category and variation
            setProductCategory(transaction.ProductName || "Non-judicial stamp");
            setProductVariation(transaction.ProductVariation || "");

            // Set quantity and pricing
            setQuantity(transaction.quantity?.toString() || "");
            setSellingPrice(transaction.sellingPrice?.toString() || "");
            setCogs(transaction.cogs?.toString() || "");
            setNetProfit(transaction.NetProfit?.toString() || "");

            // Set customer
            setCustomerId(transaction.CustomerID || "");

            // Set date and time
            if (transaction.Date) {
                const date = new Date(transaction.Date);
                if (transaction.Time) {
                    const timeParts = transaction.Time.split(':');
                    if (timeParts.length >= 2) {
                        date.setHours(parseInt(timeParts[0], 10));
                        date.setMinutes(parseInt(timeParts[1], 10));
                        if (timeParts.length > 2) {
                            date.setSeconds(parseInt(timeParts[2], 10));
                        }
                    }
                }
                setSelectedDateTime(date);
            }

            // Set customer information
            if (transaction.CustomerID && customerDetails[transaction.CustomerID]) {
                const customer = customerDetails[transaction.CustomerID];
                setSelectedCustomer(customer);
                setSearchTerm(customer.Name || "");
            }
        }
    }, [transaction, isOpen, customerDetails]);

    // Load customers from DynamoDB
    useEffect(() => {
        if (auth.isAuthenticated && isOpen) {
            fetchCustomers();
        }
    }, [auth.isAuthenticated, isOpen]);

    // Calculate net profit when quantity, sellingPrice, or cogs changes
    useEffect(() => {
        if (quantity && sellingPrice && cogs) {
            const quantityNum = parseFloat(quantity);
            const sellingPriceNum = parseFloat(sellingPrice);
            const cogsNum = parseFloat(cogs);

            if (!isNaN(quantityNum) && !isNaN(sellingPriceNum) && !isNaN(cogsNum)) {
                const profit = (quantityNum * sellingPriceNum) - (cogsNum * quantityNum);
                setNetProfit(profit.toFixed(2));
            }
        }
    }, [quantity, sellingPrice, cogs]);

    const fetchCustomers = async () => {
        try {
            const idToken = auth.user?.id_token || auth.user?.access_token;
            const dynamoClient = createDynamoDBClient(idToken);

            const command = new ScanCommand({ TableName: CUSTOMERS_TABLE_NAME });
            const response = await dynamoClient.send(command);
            const items = response.Items.map((item) => unmarshall(item));
            setCustomers(items);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const createDynamoDBClient = (idToken) => {
        const credentials = fromCognitoIdentityPool({
            identityPoolId: IDENTITY_POOL_ID,
            logins: {
                "cognito-idp.us-east-1.amazonaws.com/us-east-1_szDQpWkvh": idToken,
            },
            clientConfig: { region: REGION },
        });

        return new DynamoDBClient({
            region: REGION,
            credentials,
        });
    };

    const handleProductTypeChange = (e) => {
        setProductType(e.target.value);
        // Reset related fields when product type changes
        setQuantity("");
        setSellingPrice("");
        setNetProfit("");
    };

    const handleProductCategoryChange = (e) => {
        setProductCategory(e.target.value);
        setProductVariation("");
        setCogs("");
        setNetProfit("");
    };

    const handleProductVariationChange = (e) => {
        setProductVariation(e.target.value);

        // Extract COGS from variation (e.g., "20-16" -> 16)
        const cogsValue = e.target.value.split('-')[1];
        if (cogsValue && !isNaN(parseInt(cogsValue))) {
            setCogs(cogsValue);
        }
    };

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setCustomerId(customer.CustomerID);
        setSearchTerm(customer.Name);
        setShowDropdown(false);
    };

    const filterCustomers = () => {
        if (!searchTerm.trim()) return customers;

        return customers.filter(customer =>
            customer.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCustomer) {
            alert("Please select a customer");
            return;
        }

        if (!productVariation) {
            alert("Please select product variation");
            return;
        }

        if (!quantity || !sellingPrice) {
            alert("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const idToken = auth.user?.id_token || auth.user?.access_token;
            const dynamoClient = createDynamoDBClient(idToken);

            // Use the existing transaction ID
            const transactionId = transaction.TransactionID;

            // Format date as YYYY-MM-DD
            const formattedDate = selectedDateTime.toISOString().split('T')[0];

            // Format time as HH:MM:SS
            const formattedTime = selectedDateTime.toTimeString().split(' ')[0];

            // Determine which table to use based on product type
            const tableName = productType === "Retail"
                ? RETAIL_TABLE_NAME
                : WHOLESALE_TABLE_NAME;

            // Common fields
            const transactionData = {
                TransactionID: { S: transactionId },
                CustomerID: { S: customerId },
                Date: { S: formattedDate },
                Time: { S: formattedTime },
                ProductName: { S: productCategory },
                ProductVariation: { S: productVariation },
                NetProfit: { N: netProfit.toString() },
            };

            // Add type-specific fields
            if (productType === "Retail") {
                transactionData.COGS_Per_Pc = { N: cogs.toString() };
                transactionData.Quantity_Pcs = { N: quantity.toString() };
                transactionData.SellingPrice_Per_Pc = { N: sellingPrice.toString() };
            } else {
                transactionData.COGS_Per_Packet = { N: cogs.toString() };
                transactionData.Quantity_Packets = { N: quantity.toString() };
                transactionData.SellingPrice_Per_Packet = { N: sellingPrice.toString() };
            }

            await dynamoClient.send(
                new PutItemCommand({
                    TableName: tableName,
                    Item: transactionData,
                })
            );

            alert("Transaction updated successfully!");
            onClose();

        } catch (error) {
            console.error("Error updating transaction:", error);
            alert("Failed to update transaction. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <DialogTitle className="text-xl font-semibold text-gray-800">
                                        Modify Transaction
                                    </DialogTitle>
                                    <button
                                        onClick={onClose}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                    {/* Customer Name Searchable Dropdown */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Customer Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setShowDropdown(true);
                                                    if (e.target.value === "") {
                                                        setSelectedCustomer(null);
                                                        setCustomerId("");
                                                    }
                                                }}
                                                onFocus={() => setShowDropdown(true)}
                                                placeholder="Search customers..."
                                                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        {showDropdown && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                                                {filterCustomers().length > 0 ? (
                                                    filterCustomers().map((customer) => (
                                                        <div
                                                            key={customer.CustomerID}
                                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                                            onClick={() => handleCustomerSelect(customer)}
                                                        >
                                                            {customer.Name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 text-gray-500">No customer found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Customer ID (autofilled) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Customer ID
                                        </label>
                                        <input
                                            type="text"
                                            value={customerId}
                                            readOnly
                                            disabled
                                            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700"
                                        />
                                    </div>

                                    {/* Date & Time Picker */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Transaction Date & Time <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Clock size={16} className="text-gray-400" />
                                            </div>
                                            <DatePicker
                                                selected={selectedDateTime}
                                                onChange={(date) => setSelectedDateTime(date)}
                                                dateFormat="yyyy-MM-dd h:mm aa"
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                className="w-full pl-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholderText="Select date and time"
                                            />
                                        </div>
                                    </div>

                                    {/* Product Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={productType}
                                            onChange={handleProductTypeChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Retail">Retail</option>
                                            <option value="Wholesale">Wholesale</option>
                                        </select>
                                    </div>

                                    {/* Product Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={productCategory}
                                            onChange={handleProductCategoryChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Non-judicial stamp">Non-judicial stamp</option>
                                            <option value="Cartridge Paper">Cartridge Paper</option>
                                            <option value="Folio paper">Folio paper</option>
                                        </select>
                                    </div>

                                    {/* Product Variation */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Variation <span className="text-red-500">*</span>
                                        </label>
                                        {productCategory === "Non-judicial stamp" ? (
                                            <select
                                                value={productVariation}
                                                onChange={handleProductVariationChange}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Select Variation</option>
                                                {nonJudicialVariations.map((v) => (
                                                    <option key={v} value={v}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={productVariation}
                                                onChange={(e) => setProductVariation(e.target.value)}
                                                placeholder="Variation (e.g. 10-6)"
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {productType === "Retail" ? "Quantity (Pcs)" : "Quantity (Packets)"} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={quantity}
                                            min="1"
                                            onChange={(e) => setQuantity(e.target.value)}
                                            placeholder={productType === "Retail" ? "Number of pieces" : "Number of packets"}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Selling Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {productType === "Retail" ? "Selling Price (per pc)" : "Selling Price (per packet)"} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={sellingPrice}
                                            min="0"
                                            step="0.01"
                                            onChange={(e) => setSellingPrice(e.target.value)}
                                            placeholder={productType === "Retail" ? "Price per piece" : "Price per packet"}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* COGS (auto-filled) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {productType === "Retail" ? "COGS (per pc)" : "COGS (per packet)"}
                                        </label>
                                        <input
                                            type="text"
                                            value={cogs}
                                            readOnly
                                            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700"
                                        />
                                    </div>

                                    {/* Net Profit (auto-calculated) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Net Profit
                                        </label>
                                        <input
                                            type="text"
                                            value={netProfit}
                                            readOnly
                                            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center">
                                                    <svg
                                                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <Check size={18} className="mr-2" />
                                                    Update Transaction
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ModifyTransactionModal;