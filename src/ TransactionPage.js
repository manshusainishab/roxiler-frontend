import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const backendurl = 'http://localhost:5001'

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState('March');
  const [search, setSearch] = useState('');
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const [loading, setLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
    fetchPieChartData();
  }, [month]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendurl}/api/transactions`, {
        params: { search: '', page: 1, perPage: 10 }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${backendurl}/api/statistics`, { params: { month } });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`${backendurl}/api/bar-chart`, { params: { month } });
      setBarChartData(response.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(`${backendurl}/api/pie-chart`, { params: { month } });
      setPieChartData(response.data);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleMonthChange = (e) => setMonth(e.target.value);

  return (
    <div className="container">
      <h1>Transaction Dashboard</h1>

      {/* Month Dropdown and Search Box */}
      <div className="filters">
        <select onChange={handleMonthChange} value={month}>
          {months.map((m, idx) => (
            <option key={idx} value={m}>{m}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by title, description, or price"
          value={search}
          onChange={handleSearchChange}
        />
        <button onClick={fetchTransactions}>Search</button>
      </div>

      {/* Transaction Table */}
      <div className="transactions-table">
        <h2>Transactions</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Date of Sale</th>
                <th>Sold</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.price}</td>
                  <td>{transaction.category}</td>
                  <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                  <td>{transaction.sold ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Statistics Section */}
      <div className="statistics">
        <h2>Statistics</h2>
        <p>Total Sales: {statistics.totalSales}</p>
        <p>Total Sold: {statistics.totalSold}</p>
        <p>Total Not Sold: {statistics.totalNotSold}</p>
      </div>

      {/* Bar Chart */}
      <div className="chart">
        <h2>Price Range Distribution</h2>
        <Bar data={barChartData} options={{ responsive: true }} />
      </div>

      {/* Pie Chart */}
      <div className="chart">
        <h2>Category Distribution</h2>
        <Pie data={pieChartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default TransactionPage;
