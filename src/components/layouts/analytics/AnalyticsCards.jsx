import {
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaWallet,
  FaReceipt,
} from "react-icons/fa6";

function AnalyticsCards({
  analytics,
}) {
  const cards = [
    {
      title: "Income",
      value: analytics.income || 0,
      icon: <FaArrowTrendUp />,
      color: "text-green-400",
    },

    {
      title: "Expense",
      value: analytics.expense || 0,
      icon: <FaArrowTrendDown />,
      color: "text-red-400",
    },

    {
      title: "Balance",
      value: analytics.balance || 0,
      icon: <FaWallet />,
      color: "text-cyan-400",
    },

    {
      title: "Transactions",
      value:
        analytics.totalTransactions ||
        0,
      icon: <FaReceipt />,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white/[0.05] border border-white/10 rounded-3xl p-5"
        >
          <div className="flex justify-between items-center">

            <p className="text-slate-400">
              {card.title}
            </p>

            <div
              className={card.color}
            >
              {card.icon}
            </div>

          </div>

          <h2 className="text-3xl font-black mt-4">

            {card.title ===
            "Transactions"
              ? card.value
              : `₹${Number(
                  card.value
                ).toLocaleString()}`}

          </h2>
        </div>
      ))}
    </div>
  );
}

export default AnalyticsCards;