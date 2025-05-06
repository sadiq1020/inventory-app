import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { createDynamoDBClient } from "./aws-config";

export const saveCustomer = async (customer, idToken) => {
    const client = createDynamoDBClient(idToken);

    const command = new PutItemCommand({
        TableName: "Customer_Information",
        Item: {
            CustomerID: { S: customer.CustomerID },
            Name: { S: customer.Name },
            Address: { S: customer.Address },
            CustomerType: { S: customer.CustomerType },
            Email: { S: customer.Email },
            PhoneNumber: { S: customer.PhoneNumber },
        },
    });

    await client.send(command);
};
