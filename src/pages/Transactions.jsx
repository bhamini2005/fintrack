import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaMagnifyingGlass,
  FaChevronDown,
  FaChevronUp,
  FaPen,
  FaTrash,
} from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";

import { getTransactions } from "../services/transactionService";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
  useState("");

  const [type, setType] = useState("");

  const [expandedId, setExpandedId] =
    useState(null);

  const [analytics, setAnalytics] =
    useState({
      income: 0,
      expense: 0,
      balance: 0,
      totalTransactions: 0,
    });

  // ================= FETCH =================

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await getTransactions({
        type,
      });

      const txns =
        res.data.transactions || [];

      setTransactions(txns);

      const income = txns
        .filter((t) => t.type === "income")
        .reduce(
          (sum, t) =>
            sum + Number(t.amount),
          0
        );

      const expense = txns
        .filter((t) => t.type === "expense")
        .reduce(
          (sum, t) =>
            sum + Number(t.amount),
          0
        );

      setAnalytics({
        income,
        expense,
        balance: income - expense,
        totalTransactions:
          txns.length,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {

  fetchTransactions();

}, [type]);

// Debounced Search
useEffect(() => {

  const timer = setTimeout(() => {

    setDebouncedSearch(search);

  }, 300);

  return () => clearTimeout(timer);

}, [search]);

// Refresh when transaction added
useEffect(() => {

  const refreshTransactions = () => {

    fetchTransactions();

  };

  window.addEventListener(
    "transactionAdded",
    refreshTransactions
  );

  return () => {

    window.removeEventListener(
      "transactionAdded",
      refreshTransactions
    );

  };

}, [type]);
  // ================= SEARCH =================

const filteredTransactions =
  transactions.filter((txn) => {

    const searchTerm =
      debouncedSearch.toLowerCase();

    return (

      (txn.description || "")
        .toLowerCase()
        .includes(searchTerm)

      ||

      (txn.payment_method || "")
        .toLowerCase()
        .includes(searchTerm)

      ||

      (txn.type || "")
        .toLowerCase()
        .includes(searchTerm)

      ||

      String(txn.amount)
        .includes(searchTerm)

    );

  });

  return (
    <div className="max-w-7xl mx-auto text-white">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl lg:text-4xl font-black">
          Transactions
        </h1>

        <p className="text-slate-400 mt-2">
          Manage all your income and expenses
        </p>

      </div>

      {/* ANALYTICS */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">

          <p className="text-slate-400 text-sm">
            Income
          </p>

          <h2 className="text-2xl lg:text-3xl font-black text-green-400 mt-3">

            ₹{analytics.income.toLocaleString()}

          </h2>

        </div>

        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">

          <p className="text-slate-400 text-sm">
            Expense
          </p>

          <h2 className="text-2xl lg:text-3xl font-black text-red-400 mt-3">

            ₹{analytics.expense.toLocaleString()}

          </h2>

        </div>

        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">

          <p className="text-slate-400 text-sm">
            Balance
          </p>

          <h2 className="text-2xl lg:text-3xl font-black text-cyan-400 mt-3">

            ₹{analytics.balance.toLocaleString()}

          </h2>

        </div>

        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">

          <p className="text-slate-400 text-sm">
            Transactions
          </p>

          <h2 className="text-2xl lg:text-3xl font-black mt-3">

            {analytics.totalTransactions}

          </h2>

        </div>

      </div>

      {/* FILTERS */}

      <div className="grid gap-4 lg:grid-cols-2 mt-8">

        <div className="relative">

          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            placeholder="Search by description, payment method, type or amount..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
          />

        </div>

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-4 text-white"
        >

          <option value="">
            All Transactions
          </option>

          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>

        </select>
      </div>
<div className="mt-4 flex items-center justify-between">

  <p className="text-slate-400 text-sm">

    Showing

    <span className="text-white font-semibold mx-1">

      {filteredTransactions.length}

    </span>

    of

    <span className="text-white font-semibold mx-1">

      {transactions.length}

    </span>

    transactions

  </p>

</div>

      {/* TRANSACTIONS */}

      <div className="mt-8">

        {loading ? (

          <div className="text-center py-10">

            Loading Transactions...

          </div>

        ) : filteredTransactions.length > 0 ? (

          <div className="space-y-4">

            {filteredTransactions.map(
              (txn) => (

                <div
                  key={txn.id}
                  className="bg-white/[0.05] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl"
                >

                  {/* HEADER */}

                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === txn.id
                          ? null
                          : txn.id
                      )
                    }
                    className="w-full p-5 flex items-center justify-between text-left"
                  >

                    <div>

                      <h3 className="font-bold text-lg">

                        {txn.description ||
                          "Transaction"}

                      </h3>

                      <p className="text-slate-400 text-sm mt-1 capitalize">

                        {txn.payment_method}

                      </p>

                    </div>

                    <div className="flex items-center gap-5">

                      <div className="text-right">

                        <h3
                          className={`font-bold text-lg ${
                            txn.type ===
                            "income"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >

                          {txn.type ===
                          "income"
                            ? "+"
                            : "-"}

                          ₹
                          {Number(
                            txn.amount
                          ).toLocaleString()}

                        </h3>

                        <p className="text-slate-400 text-sm mt-1">

                          {new Date(
                            txn.txn_date
                          ).toLocaleDateString()}

                        </p>

                      </div>

                      {expandedId ===
                      txn.id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}

                    </div>

                  </button>

                  {/* DETAILS */}

                  {expandedId ===
                    txn.id && (

                    <div className="border-t border-white/10 p-5 bg-white/[0.02]">

                      <div className="grid grid-cols-2 gap-4">

                        <div>

                          <p className="text-slate-500 text-xs">

                            Type

                          </p>

                          <p className="mt-1 capitalize">

                            {txn.type}

                          </p>

                        </div>

                        <div>

                          <p className="text-slate-500 text-xs">

                            Payment

                          </p>

                          <p className="mt-1 capitalize">

                            {
                              txn.payment_method
                            }

                          </p>

                        </div>

                        <div>

                          <p className="text-slate-500 text-xs">

                            Amount

                          </p>

                          <p className="mt-1">

                            ₹
                            {Number(
                              txn.amount
                            ).toLocaleString()}

                          </p>

                        </div>

                        <div>

                          <p className="text-slate-500 text-xs">

                            Date

                          </p>

                          <p className="mt-1">

                            {new Date(
                              txn.txn_date
                            ).toLocaleDateString()}

                          </p>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex gap-3 mt-5">

                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400">

                          <FaPen />

                          Edit

                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400">

                          <FaTrash />

                          Delete

                        </button>

                      </div>

                    </div>
                  )}

                </div>
              )
            )}

          </div>

        ) : (

          <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-10 text-center">

            <p className="text-slate-400">

              No transactions found

            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Transactions;