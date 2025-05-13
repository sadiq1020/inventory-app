// src/utils/stockService.js
import { ScanCommand, DeleteItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { createDynamoDBClient } from "../aws/aws-config";

export const fetchStock = async (tableName, token) => {
    const client = await createDynamoDBClient(token);

    const command = new ScanCommand({
        TableName: tableName,
    });

    const response = await client.send(command);

    const quantityField = tableName === "Retail_Stock" ? "Quantity_pcs" : "Quantity_packets";

    const stock = response.Items?.map((item) => ({
        id: `${item.ItemType?.S}-${item.VariationName?.S}`,
        itemType: item.ItemType?.S || "",
        variationName: item.VariationName?.S || "",
        quantity: Number(item[quantityField]?.N || 0),
        unitPrice: Number(item.UnitPrice?.N || 0),
        lowStockThreshold: Number(item.LowStockThreshold?.N || 10),
    })) || [];

    return stock;
};

export const deleteStockItem = async (tableName, itemType, variationName, token) => {
    const client = await createDynamoDBClient(token);

    const command = new DeleteItemCommand({
        TableName: tableName,
        Key: {
            ItemType: { S: itemType },
            VariationName: { S: variationName }
        }
    });

    return await client.send(command);
};

export const getStockItem = async (tableName, itemType, variationName, token) => {
    const client = await createDynamoDBClient(token);

    const command = new GetItemCommand({
        TableName: tableName,
        Key: {
            ItemType: { S: itemType },
            VariationName: { S: variationName }
        }
    });

    const response = await client.send(command);

    if (!response.Item) {
        return null;
    }

    const quantityField = tableName === "Retail_Stock" ? "Quantity_pcs" : "Quantity_packets";

    return {
        itemType: response.Item.ItemType?.S || "",
        variationName: response.Item.VariationName?.S || "",
        quantity: Number(response.Item[quantityField]?.N || 0),
        unitPrice: Number(response.Item.UnitPrice?.N || 0),
        lowStockThreshold: Number(response.Item.LowStockThreshold?.N || 10),
    };
};