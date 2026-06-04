import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import {
  FaArrowUp, FaArrowDown, FaMobileAlt, FaTv,
  FaMoneyBillWave, FaDatabase, FaExchangeAlt
} from "react-icons/fa";

const cookies = new Cookies();

const debitTypes = ["transfer", "withdrawal", "airtime", "data", "gotv", "dstv", "startimes"];

const getIcon = (type) => {
  const map = {
    transfer: <FaExchangeAlt />,
    withdrawal: <FaArrowUp />,
    deposit: <FaMoneyBillWave />,
    airtime: <FaMobileAlt />,
    data: <FaDatabase />,
    gotv: <FaTv />,
    dstv: <FaTv />,
    startimes: <FaTv />,
  };
  return map[type?.toLowerCase()] || <FaMoneyBillWave />;
};

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = cookies.get("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/wallet/transactions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="transactions-card">
      <div className="card-header">
        <h3>Recent Transactions</h3>
        <span className="tx-count">{transactions.length} total</span>
      </div>

      {loading ? (
        <p className="tx-empty">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="tx-empty">No transactions yet</p>
      ) : (
        transactions.slice(0, 6).map((tx, index) => {
          const isDebit = debitTypes.includes(tx.type?.toLowerCase());
          return (
            <div className="transaction-item" key={index}>
              <div className={`tx-icon-wrap ${isDebit ? 'debit' : 'credit'}`}>
                {getIcon(tx.type)}
              </div>
              <div className="tx-details">
                <strong>{tx.description || tx.type}</strong>
                <small>{new Date(tx.createdAt).toLocaleDateString()}</small>
              </div>
              <span className={`tx-amount ${isDebit ? 'debit' : 'credit'}`}>
                {isDebit ? '-' : '+'}₦{tx.amount.toLocaleString()}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default RecentTransactions;