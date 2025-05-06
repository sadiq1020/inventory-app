// src/components/AddTransactionModal.jsx
import React, { Fragment, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Transition, TransitionChild } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const nonJudicialVariations = [
    "100-90", "50-46", "40-35", "30-26", "25-21", "20-16", "10-8", "5-3"
];

function AddTransactionModal({ isOpen, onClose }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [productType, setProductType] = useState("Retail");
    const [productCategory, setProductCategory] = useState("Non-judicial stamp");

    const handleProductTypeChange = (e) => {
        setProductType(e.target.value);
    };

    const handleProductCategoryChange = (e) => {
        setProductCategory(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Just logging for now. You'll integrate DynamoDB later.
        console.log("Transaction Submitted");
        onClose();
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
                    <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
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
                            <DialogPanel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
                                <DialogTitle className="text-xl font-semibold mb-4">
                                    Add New Transaction
                                </DialogTitle>

                                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                    {/* Customer Name Dropdown (searchable later) */}
                                    <input
                                        type="text"
                                        name="customerName"
                                        placeholder="Customer Name (Dropdown later)"
                                        className="border p-2 rounded"
                                    />

                                    {/* Customer ID (autofilled later) */}
                                    <input
                                        type="text"
                                        name="customerId"
                                        placeholder="Customer ID (Auto)"
                                        disabled
                                        className="border p-2 rounded bg-gray-100 text-gray-700"
                                    />

                                    {/* Date Picker */}
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        className="border p-2 rounded w-full"
                                        placeholderText="Select date"
                                    />

                                    {/* Product Type */}
                                    <select
                                        name="productType"
                                        value={productType}
                                        onChange={handleProductTypeChange}
                                        className="border p-2 rounded"
                                    >
                                        <option value="Retail">Retail</option>
                                        <option value="Wholesale">Wholesale</option>
                                    </select>

                                    {/* Product Variation */}
                                    <select
                                        name="productCategory"
                                        value={productCategory}
                                        onChange={handleProductCategoryChange}
                                        className="border p-2 rounded"
                                    >
                                        <option value="Non-judicial stamp">Non-judicial stamp</option>
                                        <option value="Cartridge Paper">Cartridge Paper</option>
                                        <option value="Folio paper">Folio paper</option>
                                    </select>

                                    {productCategory === "Non-judicial stamp" && (
                                        <select name="productVariation" className="border p-2 rounded">
                                            <option value="">Select Variation</option>
                                            {nonJudicialVariations.map((v) => (
                                                <option key={v} value={v}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {productCategory !== "Non-judicial stamp" && (
                                        <input
                                            name="productVariation"
                                            placeholder="Variation (e.g. 10-6)"
                                            className="border p-2 rounded"
                                        />
                                    )}

                                    {/* Quantity */}
                                    <input
                                        type="number"
                                        name={productType === "Retail" ? "Quantity_Pcs" : "Quantity_Packets"}
                                        placeholder={productType === "Retail" ? "Quantity_Pcs" : "Quantity_Packets"}
                                        className="border p-2 rounded"
                                    />

                                    {/* Selling Price */}
                                    <input
                                        type="number"
                                        name="sellingPrice"
                                        placeholder="Selling Price"
                                        className="border p-2 rounded"
                                    />

                                    {/* COGS (auto-filled later) */}
                                    <input
                                        type="number"
                                        name={productType === "Retail" ? "COGS_Pcs" : "COGS_Packets"}
                                        placeholder={productType === "Retail" ? "COGS_Pcs" : "COGS_Packets"}
                                        disabled
                                        className="border p-2 rounded bg-gray-100 text-gray-700"
                                    />

                                    {/* Net Profit (auto-calculated later) */}
                                    <input
                                        type="number"
                                        name="netProfit"
                                        placeholder="Net Profit"
                                        disabled
                                        className="border p-2 rounded bg-gray-100 text-gray-700"
                                    />

                                    <button
                                        type="submit"
                                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default AddTransactionModal;
