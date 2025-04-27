// src/components/AddCustomerModal.jsx
import { v4 as uuidv4 } from 'uuid';
import React, { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Transition, TransitionChild } from "@headlessui/react";

function AddCustomerModal({ isOpen, onClose }) {

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Read form fields (e.target elements)
        const formData = new FormData(e.target);

        const newCustomer = {
            CustomerID: uuidv4(), // ✅ Unique ID generated
            Name: formData.get('name'),
            Address: formData.get('address'),
            CustomerType: formData.get('customerType'),
            Email: formData.get('email'),
            PhoneNumber: formData.get('phoneNumber'),
        };

        console.log('Customer to save:', newCustomer);

        // Later here you will add AWS DynamoDB code like:
        // await saveCustomerToDynamoDB(newCustomer);

        // After successful save
        alert('Customer Added Successfully!');
        onClose(); // Close modal
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
                            <DialogPanel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                                <DialogTitle className="text-xl font-semibold mb-4">
                                    Add New Customer
                                </DialogTitle>

                                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        required
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        className="border p-2 rounded"
                                    />
                                    <select
                                        name="customerType"
                                        required
                                        className="border p-2 rounded"
                                    >
                                        <option value="">Select Customer Type</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Wholesale">Wholesale</option>
                                    </select>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        required
                                        className="border p-2 rounded"
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

export default AddCustomerModal;
