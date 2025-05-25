// src/pages/ReportsPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import { fetchTransactionReports } from "../utils/reportService";

const COLORS = ["#1D4ED8", "#16A34A", "#F59E0B", "#EF4444", "#6366F1", "#8B5CF6"];

function ReportsPage() {
    const auth = useAuth();
    const [dailySales, setDailySales] = useState([]);
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [profitByCategory, setProfitByCategory] = useState([]);
    const [profitByType, setProfitByType] = useState([]);
    const [cumulativeProfit, setCumulativeProfit] = useState([]);
    // const [customerFrequency, setCustomerFrequency] = useState([]);
    const [transactionsByDay, setTransactionsByDay] = useState([]);
    const [salesByProductType, setSalesByProductType] = useState([]);

    useEffect(() => {
        const loadReports = async () => {
            if (!auth.user) return;
            const idToken = auth.user.id_token;
            const data = await fetchTransactionReports(idToken);
            setDailySales(data.dailySales);
            setMonthlySummary(data.monthlySummary);
            setTopProducts(data.topProducts);
            setProfitByCategory(data.profitByCategory);
            setProfitByType(data.profitByType);
            setCumulativeProfit(data.cumulativeProfit);
            // setCustomerFrequency(data.customerFrequency);
            setTransactionsByDay(data.transactionsByDay);
            setSalesByProductType(data.salesByProductType);
        };
        loadReports();
    }, [auth.user]);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <PageHeader title="Sales Reports" />
                <main className="p-6 max-w-7xl mx-auto space-y-10">
                    {/* 1. Daily Sales Trend */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">📈 Daily Sales Trend</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dailySales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="retail" stroke="#1D4ED8" name="Retail Sales" />
                                <Line type="monotone" dataKey="wholesale" stroke="#16A34A" name="Wholesale Sales" />
                            </LineChart>
                        </ResponsiveContainer>
                    </section>

                    {/* 2. Monthly Summary */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">📊 Monthly Sales Summary</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlySummary}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                                <Bar dataKey="quantity" fill="#10B981" name="Quantity Sold" />
                                <Bar dataKey="profit" fill="#F59E0B" name="Net Profit" />
                            </BarChart>
                        </ResponsiveContainer>
                    </section>

                    {/* 3. Top Selling Products */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">🏆 Top Selling Products</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="product" type="category" width={100} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantity" fill="#6366F1" name="Quantity Sold" />
                                <Bar dataKey="revenue" fill="#EF4444" name="Total Revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </section>

                    {/* 4. Profit by Category */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">📌 Net Profit by Product Category</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={profitByCategory} dataKey="profit" nameKey="category" outerRadius={120} label>
                                    {profitByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </section>

                    {/* 5. Profit by Channel */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">📦 Profit Distribution: Retail vs Wholesale</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={profitByType} dataKey="profit" nameKey="type" outerRadius={120} label>
                                    {profitByType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </section>

                    {/* 6. Cumulative Net Profit */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">📈 Cumulative Net Profit Over Time</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={cumulativeProfit}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="cumulative" stroke="#8B5CF6" name="Cumulative Profit" />
                            </LineChart>
                        </ResponsiveContainer>
                    </section>

                    {/* 7. Customer Frequency */}
                    {/* <section>
                        <h2 className="text-xl font-semibold mb-4">👥 Top Customer Purchase Frequency</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={customerFrequency}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="customerId" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#F97316" name="Transaction Count" />
                            </BarChart>
                        </ResponsiveContainer>
                    </section> */}

                    {/* 8. Transactions by Day of Week */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">📅 Transaction Volume by Day of Week</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={transactionsByDay}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#0EA5E9" name="Transactions" />
                            </BarChart>
                        </ResponsiveContainer>
                    </section>

                    {/* 9. Sales by Product Type */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">📚 Sales by Product Type</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesByProductType}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="type" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="retail" fill="#3B82F6" name="Retail Sales" />
                                <Bar dataKey="wholesale" fill="#10B981" name="Wholesale Sales" />
                            </BarChart>
                        </ResponsiveContainer>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default ReportsPage;
