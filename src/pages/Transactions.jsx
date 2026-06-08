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

// import { getTransactions } from "../services/transactionService";

// edit and delete functions
import {
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "../services/transactionService";
//modal
import AddTransactionModal from "../components/layouts/AddTransactionModal";



function Transactions() {
  const [openModal, setOpenModal] = useState(false);

const [editTransaction, setEditTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [type, setType] = useState("");

  const [expandedId, setExpandedId] = useState(null);

  const [analytics, setAnalytics] = useState({
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

      const txns = res.data.transactions || [];

      setTransactions(txns);

      const income = txns
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense = txns
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      setAnalytics({
        income,
        expense,
        balance: income - expense,
        totalTransactions: txns.length,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmDelete) return;

    try {
      await deleteTransaction(id);

      setTransactions((prev) => prev.filter((txn) => txn.id !== id));

      fetchTransactions();

      alert("Transaction deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
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

    window.addEventListener("transactionAdded", refreshTransactions);

    return () => {
      window.removeEventListener("transactionAdded", refreshTransactions);
    };
  }, [type]);
  // ================= SEARCH =================

  const filteredTransactions = transactions.filter((txn) => {
    const searchTerm = debouncedSearch.toLowerCase();

    return (
      (txn.description || "").toLowerCase().includes(searchTerm) ||
      (txn.payment_method || "").toLowerCase().includes(searchTerm) ||
      (txn.type || "").toLowerCase().includes(searchTerm) ||
      String(txn.amount).includes(searchTerm)
    );
  });
  // ================= EXPORT PDF =================
  const exportPDF = () => {
    const doc = new jsPDF();

    // ================= HEADER =================

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("FinTrack", 14, 18);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Personal Finance Management System", 14, 25);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // ================= REPORT INFO =================

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    doc.text("Transactions Report", 14, 45);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 52);

    // ================= SUMMARY CARDS =================

    // Income Card
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(14, 60, 55, 25, 3, 3, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Income", 18, 69);

    doc.setFontSize(14);
    doc.text(`Rs. ${analytics.income.toLocaleString("en-IN")}`, 18, 80);

    // Expense Card
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(78, 60, 55, 25, 3, 3, "F");

    doc.setFontSize(10);
    doc.text("Expense", 82, 69);

    doc.setFontSize(14);
    doc.text(`Rs. ${analytics.expense.toLocaleString("en-IN")}`, 82, 80);

    // Balance Card
    doc.setFillColor(224, 242, 254);
    doc.roundedRect(142, 60, 55, 25, 3, 3, "F");

    doc.setFontSize(10);
    doc.text("Balance", 146, 69);

    doc.setFontSize(14);
    doc.text(`Rs. ${analytics.balance.toLocaleString("en-IN")}`, 146, 80);

    // ================= TRANSACTION TABLE =================

    autoTable(doc, {
      startY: 95,

      head: [["Description", "Type", "Amount", "Payment Method", "Date"]],

      body: filteredTransactions.map((txn) => [
        txn.description || "Transaction",

        txn.type === "income" ? "Income" : "Expense",

        `Rs. ${Number(txn.amount).toLocaleString("en-IN")}`,

        txn.payment_method || "-",

        new Date(txn.txn_date).toLocaleDateString("en-IN"),
      ]),

      theme: "striped",

      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 4,
        textColor: [30, 41, 59],
        overflow: "linebreak",
      },

      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 11,
        halign: "center",
      },

      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },

      columnStyles: {
        0: { cellWidth: 45, halign: "center" },
        1: { cellWidth: 25, halign: "center" },
        2: { cellWidth: 35, halign: "center" },
        3: { cellWidth: 45, halign: "center" },
        4: { cellWidth: 30, halign: "center" },
      },
    });

    // ================= FOOTER =================

    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setDrawColor(200);

      doc.line(14, 285, 196, 285);

      doc.setFontSize(9);

      doc.text(`Generated by FinTrack`, 14, 290);

      doc.text(`Page ${i} of ${pageCount}`, 170, 290);
    }

    // ================= DOWNLOAD =================

    doc.save(`FinTrack_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // ================= END EXPORT PDF =================

  return (
    <div className="max-w-7xl mx-auto text-white">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl lg:text-4xl font-black">Transactions</h1>

        <p className="text-slate-400 mt-2">
          Manage all your income and expenses
        </p>
      </div>

      {/* ANALYTICS */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">
          <p className="text-slate-400 text-sm">Income</p>

          <h2 className="text-2xl lg:text-3xl font-black text-green-400 mt-3">
            ₹{analytics.income.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">
          <p className="text-slate-400 text-sm">Expense</p>

          <h2 className="text-2xl lg:text-3xl font-black text-red-400 mt-3">
            ₹{analytics.expense.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">
          <p className="text-slate-400 text-sm">Balance</p>

          <h2 className="text-2xl lg:text-3xl font-black text-cyan-400 mt-3">
            ₹{analytics.balance.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">
          <p className="text-slate-400 text-sm">Transactions</p>

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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
          />
        </div>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-4 text-white"
        >
          <option value="">All Transactions</option>

          <option value="income">Income</option>

          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-600 transition font-semibold"
        >
          <FaFilePdf />
          Export PDF
        </button>
      </div>

      {/* TRANSACTIONS */}

      <div className="mt-8">
        {loading ? (
          <div className="text-center py-10">Loading Transactions...</div>
        ) : filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="bg-white/[0.05] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl"
              >
                {/* HEADER */}

                <button
                  onClick={() =>
                    setExpandedId(expandedId === txn.id ? null : txn.id)
                  }
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div>
                    <h3 className="font-bold text-lg">
                      {txn.description || "Transaction"}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1 capitalize">
                      {txn.payment_method}
                    </p>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <h3
                        className={`font-bold text-lg ${
                          txn.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {txn.type === "income" ? "+" : "-"}₹
                        {Number(txn.amount).toLocaleString()}
                      </h3>

                      <p className="text-slate-400 text-sm mt-1">
                        {new Date(txn.txn_date).toLocaleDateString()}
                      </p>
                    </div>

                    {expandedId === txn.id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </button>

                {/* DETAILS */}

                {expandedId === txn.id && (
                  <div className="border-t border-white/10 p-5 bg-white/[0.02]">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-500 text-xs">Type</p>

                        <p className="mt-1 capitalize">{txn.type}</p>
                      </div>

                      <div>
                        <p className="text-slate-500 text-xs">Payment</p>

                        <p className="mt-1 capitalize">{txn.payment_method}</p>
                      </div>

                      <div>
                        <p className="text-slate-500 text-xs">Amount</p>

                        <p className="mt-1">
                          ₹{Number(txn.amount).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500 text-xs">Date</p>

                        <p className="mt-1">
                          {new Date(txn.txn_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => {
                          setEditTransaction(txn);
                          setOpenModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400"
                      >
                        <FaPen />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(txn.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-10 text-center">
            <p className="text-slate-400">No transactions found</p>
          </div>
        )}
      </div>
      <AddTransactionModal
        open={openModal}
        editTransaction={editTransaction}
        onClose={() => {
          setOpenModal(false);
          setEditTransaction(null);
          fetchTransactions();
        }}
      />
    </div>
  );
}

export default Transactions;
