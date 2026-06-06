import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FaArrowTrendUp, FaArrowTrendDown, FaWallet } from "react-icons/fa6";

import {
  getDashboardSummary,
  getRecentTransactions,
} from "../services/dashboardService";

function Dashboard() {
  // ================= STATES =================

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= FETCH DASHBOARD =================

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [summaryRes, transactionsRes] = await Promise.all([
        getDashboardSummary(),
        getRecentTransactions(),
      ]);

      // ================= SUMMARY =================

      setSummary({
        income: Number(summaryRes?.data?.income) || 0,

        expense: Number(summaryRes?.data?.expense) || 0,

        balance: Number(summaryRes?.data?.balance) || 0,
      });

      // ================= TRANSACTIONS =================

      const transactionData = Array.isArray(transactionsRes.data)
        ? transactionsRes.data
        : transactionsRes.data.transactions || [];

      setTransactions(transactionData);
    } catch (err) {
      console.log("DASHBOARD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ================= AUTO REFRESH =================

  useEffect(() => {
    const handleRefresh = () => {
      fetchDashboard();
    };

    window.addEventListener("transactionAdded", handleRefresh);

    return () => {
      window.removeEventListener("transactionAdded", handleRefresh);
    };
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-52 rounded-3xl bg-white/5"></div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-28 rounded-3xl bg-white/5"></div>

          <div className="h-28 rounded-3xl bg-white/5"></div>

          <div className="h-28 rounded-3xl bg-white/5 col-span-2 lg:col-span-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ================= BALANCE CARD ================= */}

      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl p-6 lg:p-8 shadow-2xl">
        {/* Glow */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 rounded-full bg-white/10 blur-3xl"></div>

        <p className="text-white/80 text-sm">Total Balance</p>

        <h1 className="text-4xl lg:text-5xl font-black mt-3 tracking-tight">
          ₹{(summary.balance || 0).toLocaleString()}
        </h1>

        <div className="flex items-center gap-3 mt-5">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-md">
            Smart Tracking
          </span>

          <p className="text-white/80 text-sm">Updated in real-time</p>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Income */}
        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Income</p>

            <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400">
              <FaArrowTrendUp />
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-black mt-4 text-white">
            ₹{(summary.income || 0).toLocaleString()}
          </h2>
        </div>

        {/* Expense */}
        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Expense</p>

            <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400">
              <FaArrowTrendDown />
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-black mt-4 text-white">
            ₹{(summary.expense || 0).toLocaleString()}
          </h2>
        </div>

        {/* Savings */}
        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5 backdrop-blur-xl col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Savings</p>

            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FaWallet />
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-black mt-4 text-white">
            ₹{(summary.income - summary.expense).toLocaleString()}
          </h2>
        </div>
      </div>

      {/* ================= RECENT TRANSACTIONS ================= */}

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Recent Transactions</h2>

 <Link
  to="/transactions"
  className="text-cyan-400 text-sm hover:underline"
>
  View All
</Link>
        </div>

        <div className="space-y-4 mt-5">
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <div
                key={txn.id}
                className="bg-white/[0.05] border border-white/10 rounded-3xl p-5 flex items-center justify-between backdrop-blur-xl hover:bg-white/[0.07] transition"
              >
                {/* LEFT */}
                <div>
                  <h3 className="font-bold text-base text-white">
                    {txn.description || "Transaction"}
                  </h3>

                  <p className="text-slate-400 text-sm mt-1 capitalize">
                    {txn.payment_method || "UPI"}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <h3
                    className={`font-bold text-lg ${
                      txn.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {txn.type === "income" ? "+" : "-"}₹
                    {Number(txn.amount).toLocaleString()}
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    {txn.txn_date
                      ? new Date(txn.txn_date).toLocaleDateString()
                      : "Today"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-8 text-center">
              <p className="text-slate-400">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
