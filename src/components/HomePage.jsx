import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function HomePage() {
    const [formData, setFormData] = useState({
        customerId: uuidv4(),
        customerType: 'Retail',
        name: '',
        phoneNumber: '',
        address: '',
        email: '',
        quantity: '',
        productType: '',
        productVariation: '',
        sellingPrice: '',
        cogs: '',
        netProfit: 0,
    });

    const nonJudicialVariations = [
        '100-90', '50-46', '40-35', '30-26', '25-21', '20-16', '10-8', '5-3'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'sellingPrice' || name === 'quantity' || name === 'cogs'
                ? {
                    netProfit:
                        (Number(name === 'quantity' ? value : prev.quantity) *
                            Number(name === 'sellingPrice' ? value : prev.sellingPrice)) -
                        Number(name === 'cogs' ? value : prev.cogs),
                }
                : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const customerData = {
            CustomerID: formData.customerId,
            CustomerType: formData.customerType,
            Name: formData.name,
            PhoneNumber: formData.phoneNumber,
            Address: formData.address,
            Email: formData.email,
            PreviousTransactionHistory: [],
        };

        const transactionData = {
            TransactionID: uuidv4(),
            CustomerID: formData.customerId,
            Quantity: Number(formData.quantity),
            ProductVariation: `${formData.productType} - ${formData.productVariation}`,
            SellingPrice: Number(formData.sellingPrice),
            COGS: Number(formData.cogs),
            NetProfit: formData.netProfit,
        };

        // Placeholders for API integration
        console.log('Customer Data:', customerData);
        console.log('Transaction Data:', transactionData);

        alert('Submitted! Data would be sent to DynamoDB here.');
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">New Order</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Info */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" onChange={handleChange} required placeholder="Customer Name" className="input" />
                        <input name="phoneNumber" onChange={handleChange} required placeholder="Phone Number" className="input" />
                        <input name="address" onChange={handleChange} placeholder="Address" className="input" />
                        <input name="email" onChange={handleChange} placeholder="Email" className="input" />
                        <select name="customerType" onChange={handleChange} className="input">
                            <option value="Retail">Retail</option>
                            <option value="Wholesale">Wholesale</option>
                        </select>
                    </div>
                </div>

                {/* Transaction Info */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Transaction</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="quantity" onChange={handleChange} placeholder="Quantity (Pcs)" type="number" className="input" />
                        <input name="sellingPrice" onChange={handleChange} placeholder="Selling Price" type="number" className="input" />
                        <input name="cogs" onChange={handleChange} placeholder="COGS" type="number" className="input" />
                        <select name="productType" onChange={handleChange} className="input">
                            <option value="">Select Product</option>
                            <option value="Non-judicial stamp">Non-judicial stamp</option>
                            <option value="Cartridge Paper">Cartridge Paper</option>
                            <option value="Folio paper">Folio paper</option>
                        </select>
                        {formData.productType === 'Non-judicial stamp' && (
                            <select name="productVariation" onChange={handleChange} className="input">
                                <option value="">Select Variation</option>
                                {nonJudicialVariations.map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        )}
                        {formData.productType !== 'Non-judicial stamp' && (
                            <input
                                name="productVariation"
                                onChange={handleChange}
                                placeholder="Variation (e.g. 10-6)"
                                className="input"
                            />
                        )}
                        <input
                            disabled
                            value={formData.netProfit}
                            placeholder="Net Profit"
                            className="input bg-gray-100 text-gray-700"
                        />
                    </div>
                </div>

                <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded shadow">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default HomePage;
