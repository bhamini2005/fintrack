import { useState } from "react";

import { FaXmark, FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

import api from "../../services/api";

function AddTransactionModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    payment_method: "upi",
    txn_date: "",
  });

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/transactions", formData);

      // Reset Form
      setFormData({
        type: "expense",
        amount: "",
        description: "",
        payment_method: "upi",
        txn_date: "",
      });

      // Refresh Dashboard
      window.dispatchEvent(new Event("transactionAdded"));

      // Close Modal
      onClose();
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  // ================= CLOSE =================

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-6">
      {/* Modal */}
      <div className="w-full lg:max-w-lg bg-slate-950 border border-white/10 rounded-t-[40px] lg:rounded-[40px] p-6 lg:p-8 shadow-2xl animate-[slideUp_.3s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Add Transaction</h2>

            <p className="text-slate-400 text-sm mt-1">
              Track your finances smarter
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition"
          >
            <FaXmark />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  type: "income",
                })
              }
              className={`h-14 rounded-2xl flex items-center justify-center gap-3 font-semibold transition ${
                formData.type === "income"
                  ? "bg-green-500 text-white"
                  : "bg-white/5 text-slate-300"
              }`}
            >
              <FaArrowTrendUp />
              Income
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  type: "expense",
                })
              }
              className={`h-14 rounded-2xl flex items-center justify-center gap-3 font-semibold transition ${
                formData.type === "expense"
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-slate-300"
              }`}
            >
              <FaArrowTrendDown />
              Expense
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm text-slate-300 block mb-2">Amount</label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              required
              className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none text-white placeholder:text-slate-500 focus:border-cyan-400 transition appearance-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-slate-300 block mb-2">
              Description
            </label>

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Salary, Petrol, Shopping..."
              className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none text-white placeholder:text-slate-500 focus:border-cyan-400 transition"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm text-slate-300 block mb-2">
              Payment Method
            </label>

            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full h-14 rounded-2xl bg-slate-900 border border-white/10 px-5 outline-none text-white focus:border-cyan-400 transition"
            >
              <option value="upi">UPI</option>

              <option value="cash">Cash</option>

              <option value="card">Card</option>

              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm text-slate-300 block mb-2">Date</label>

            <input
              type="date"
              name="txn_date"
              value={formData.txn_date}
              onChange={handleChange}
              className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none text-white focus:border-cyan-400 transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-lg shadow-xl hover:opacity-95 active:scale-[0.98] transition disabled:opacity-70"
          >
            {loading ? "Saving..." : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;
