import { useEffect, useState } from "react";

import AnalyticsCards from "../components/layouts/analytics/AnalyticsCards";

import {
  Bar,
  Doughnut,
  Line,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { getAnalytics } from "../services/analyticsService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function Analytics() {
  const [analytics, setAnalytics] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await getAnalytics();

      setAnalytics(res.data);

      const monthNames = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
      ];

      const monthlyData = (
        res.data.monthly || []
      ).map((item) => ({
        ...item,
        monthName:
          monthNames[item.month - 1],
      }));

      setMonthly(monthlyData);

      setCategories(
        res.data.categories || []
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading Analytics...
      </div>
    );
  }

  // ================= BAR CHART =================

  const incomeExpenseData = {
    labels: monthly.map(
      (m) => m.monthName
    ),

    datasets: [
      {
        label: "Income",
        data: monthly.map(
          (m) => m.income
        ),
        backgroundColor:
          "#22c55e",
      },

      {
        label: "Expense",
        data: monthly.map(
          (m) => m.expense
        ),
        backgroundColor:
          "#ef4444",
      },
    ],
  };

  // ================= PIE =================

  const categoryData = {
    labels: categories.map(
      (c) => c.category
    ),

    datasets: [
      {
        data: categories.map(
          (c) => c.amount
        ),

        backgroundColor: [
          "#06b6d4",
          "#8b5cf6",
          "#22c55e",
          "#ef4444",
          "#f59e0b",
          "#ec4899",
        ],
      },
    ],
  };

  // ================= LINE =================

  const trendData = {
    labels: monthly.map(
      (m) => m.monthName
    ),

    datasets: [
      {
        label: "Income",
        data: monthly.map(
          (m) => m.income
        ),
        borderColor: "#22c55e",
        backgroundColor:
          "rgba(34,197,94,.2)",
        tension: 0.4,
      },

      {
        label: "Expense",
        data: monthly.map(
          (m) => m.expense
        ),
        borderColor: "#ef4444",
        backgroundColor:
          "rgba(239,68,68,.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-black">
          Analytics
        </h1>

        <p className="text-slate-400 mt-2">
          Financial insights &
          performance
        </p>
      </div>

      {/* CARDS */}

      <AnalyticsCards
        analytics={analytics}
      />

      {/* TOP CHARTS */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* BAR */}

        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-6">

          <h2 className="font-bold text-xl mb-5">
            Income vs Expense
          </h2>

          <Bar
            data={incomeExpenseData}
          />

        </div>

        {/* PIE */}

        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-6">

          <h2 className="font-bold text-xl mb-5">
            Expense Categories
          </h2>

          <Doughnut
            data={categoryData}
          />

        </div>

      </div>

      {/* TREND */}

      <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-6">

        <h2 className="font-bold text-xl mb-5">
          Monthly Trend
        </h2>

        <Line data={trendData} />

      </div>

    </div>
  );
}

export default Analytics;