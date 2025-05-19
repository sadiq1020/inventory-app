// src/api/fetchTransactions.js
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { createDynamoDBClient } from "../aws/aws-config";

export const fetchRetailTransactions = async (idToken) => {
    const client = createDynamoDBClient(idToken);

    const command = new ScanCommand({
        TableName: "Transaction_Retail",
    });

    try {
        const response = await client.send(command);
        return response.Items.map(item => unmarshall(item));
    } catch (error) {
        console.error("Error fetching retail transactions:", error);
        throw error;
    }
};

export const fetchWholesaleTransactions = async (idToken) => {
    const client = createDynamoDBClient(idToken);

    const command = new ScanCommand({
        TableName: "Transaction_Wholesale",
    });

    try {
        const response = await client.send(command);
        return response.Items.map(item => unmarshall(item));
    } catch (error) {
        console.error("Error fetching wholesale transactions:", error);
        throw error;
    }
};

export const fetchCustomerDetails = async (idToken, customerIds) => {
    // If no customer IDs, return empty object
    if (!customerIds || customerIds.length === 0) {
        return {};
    }

    const client = createDynamoDBClient(idToken);
    const uniqueCustomerIds = [...new Set(customerIds)]; // Remove duplicates

    try {
        const command = new ScanCommand({
            TableName: "Customer_Information",
        });

        const response = await client.send(command);
        const customers = response.Items.map(item => unmarshall(item));

        // Create a lookup map of customer details by ID
        const customerMap = {};
        customers.forEach(customer => {
            customerMap[customer.CustomerID] = customer;
        });

        return customerMap;
    } catch (error) {
        console.error("Error fetching customer details:", error);
        throw error;
    }
};