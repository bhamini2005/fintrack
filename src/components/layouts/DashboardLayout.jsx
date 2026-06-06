import { Outlet, NavLink, useNavigate } from "react-router-dom";

import { useState, useRef, useEffect } from "react";

import {
  FaHouse,
  FaWallet,
  FaChartPie,
  FaUser,
  FaPlus,
  FaBell,
  FaRightFromBracket,
} from "react-icons/fa6";

import AddTransactionModal from "./AddTransactionModal";

function DashboardLayout() {
  const navigate = useNavigate();

  // ================= USER =================

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
    email: "user@example.com",
  };

  // ================= STATES =================

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const profileMenuRef = useRef();

  // ================= CLOSE DROPDOWN =================

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  // ================= ACTIVE NAV =================

  const navClass = ({ isActive }) =>
    `w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg"
        : "hover:bg-white/10 text-slate-300"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `flex flex-col items-center transition ${
      isActive ? "text-cyan-400" : "text-slate-400"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">
      {/* ================= SIDEBAR ================= */}

      <aside className="hidden lg:flex w-72 bg-white/[0.03] backdrop-blur-2xl border-r border-white/10 flex-col justify-between p-6">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center text-2xl font-black shadow-2xl">
              ₹
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">FinTrack</h1>

              <p className="text-slate-400 text-sm mt-1">
                Smart Finance Manager
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-12 space-y-3">
            <NavLink to="/dashboard" className={navClass}>
              <FaHouse />

              <span className="font-semibold">Dashboard</span>
            </NavLink>

            <NavLink to="/transactions" className={navClass}>
              <FaWallet />

              <span className="font-semibold">Transactions</span>
            </NavLink>

            <NavLink to="/analytics" className={navClass}>
              <FaChartPie />

              <span className="font-semibold">Analytics</span>
            </NavLink>

            <NavLink to="/profile" className={navClass}>
              <FaUser />

              <span className="font-semibold">Profile</span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom Mini Card */}
        {/* <div className="rounded-3xl bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 border border-white/10 p-5 backdrop-blur-xl">

          <p className="text-slate-300 text-sm">
            Logged in as
          </p>

          <h3 className="text-lg font-bold mt-2">

            {user.name}

          </h3>

          <p className="text-slate-400 text-sm mt-1 truncate">

            {user.email}

          </p>

        </div> */}
      </aside>

      {/* ================= MAIN ================= */}

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* ================= TOPBAR ================= */}

        <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 px-5 lg:px-10 py-4 flex items-center justify-between">
          {/* Left */}
          <div>
            <p className="text-slate-400 text-sm">Welcome Back 👋</p>

            <h1 className="text-2xl lg:text-3xl font-black mt-1 tracking-tight">
              {user.name}
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Desktop Add Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="hidden lg:flex h-12 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 items-center gap-3 font-semibold shadow-xl hover:scale-105 transition-all duration-300"
            >
              <FaPlus />
              Add Transaction
            </button>

            {/* Notification */}
            <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
              <FaBell />
            </button>

            {/* ================= PROFILE ================= */}

            <div className="relative" ref={profileMenuRef}>
              {/* Avatar */}
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center font-bold shadow-xl uppercase hover:scale-105 transition-all duration-300"
              >
                {user.name
                  ?.split(" ")
                  ?.map((word) => word[0])
                  ?.join("")
                  ?.slice(0, 2)}
              </button>

              {/* Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-80 bg-slate-900/95 border border-white/10 rounded-[30px] shadow-2xl overflow-hidden backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info */}
                  <div className="p-5 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center font-black text-xl uppercase shadow-xl">
                        {user.name
                          ?.split(" ")
                          ?.map((word) => word[0])
                          ?.join("")
                          ?.slice(0, 2)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-lg text-white truncate">
                          {user.name}
                        </h3>

                        <p className="text-sm text-slate-400 mt-1 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="p-3">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-red-500/10 text-red-400 transition-all duration-300"
                    >
                      <FaRightFromBracket />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}

        <div className="flex-1 overflow-y-auto p-5 lg:p-10 pb-28 lg:pb-10">
          <Outlet />
        </div>
      </main>

      {/* ================= MOBILE NAV ================= */}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-5">
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[30px] px-4 py-3 flex items-center justify-between shadow-2xl">
          {/* Dashboard */}
          <NavLink to="/dashboard" className={mobileNavClass}>
            <FaHouse className="text-xl" />

            <span className="text-xs mt-1">Home</span>
          </NavLink>

          {/* Transactions */}
          <NavLink to="/transactions" className={mobileNavClass}>
            <FaWallet className="text-xl" />

            <span className="text-xs mt-1">Transactions</span>
          </NavLink>

          {/* Add */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-16 h-16 rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center shadow-2xl -mt-10 border-4 border-slate-950 hover:scale-105 transition-all duration-300"
          >
            <FaPlus className="text-2xl" />
          </button>

          {/* Analytics */}
          <NavLink to="/analytics" className={mobileNavClass}>
            <FaChartPie className="text-xl" />

            <span className="text-xs mt-1">Analytics</span>
          </NavLink>

          {/* Profile */}
          <NavLink to="/profile" className={mobileNavClass}>
            <FaUser className="text-xl" />

            <span className="text-xs mt-1">Profile</span>
          </NavLink>
        </div>
      </div>

      {/* ================= ADD MODAL ================= */}

      <AddTransactionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}

export default DashboardLayout;
