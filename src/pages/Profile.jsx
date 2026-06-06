import { useEffect, useState } from "react";

import {
  FaUser,
  FaLock,
  FaFloppyDisk,
} from "react-icons/fa6";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/profileService";

function Profile() {

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      role: "",
      created_at: "",
    });

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  // ================= LOAD PROFILE =================

  const fetchProfile = async () => {

    try {

      const res =
        await getProfile();

      setProfile(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchProfile();

  }, []);

  // ================= UPDATE PROFILE =================

  const handleProfileUpdate =
    async (e) => {

      e.preventDefault();

      try {

        setSaving(true);

        await updateProfile({
          name: profile.name,
          email: profile.email,
        });

        // Update localStorage
        const user =
          JSON.parse(
            localStorage.getItem("user")
          ) || {};

        user.name = profile.name;
        user.email = profile.email;

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        alert(
          "Profile updated successfully"
        );

      } catch (err) {

        alert(
          err.response?.data?.message ||
            "Update failed"
        );

      } finally {

        setSaving(false);
      }
    };

  // ================= CHANGE PASSWORD =================

  const handlePasswordChange =
    async (e) => {

      e.preventDefault();

      if (
        passwordData.newPassword !==
        passwordData.confirmPassword
      ) {
        return alert(
          "Passwords do not match"
        );
      }

      try {

        setPasswordLoading(true);

        await changePassword({
          currentPassword:
            passwordData.currentPassword,

          newPassword:
            passwordData.newPassword,
        });

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        alert(
          "Password changed successfully"
        );

      } catch (err) {

        alert(
          err.response?.data?.message ||
            "Password update failed"
        );

      } finally {

        setPasswordLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading Profile...
      </div>
    );
  }

  return (

    <div className="max-w-6xl mx-auto text-white">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl lg:text-4xl font-black">
          Profile
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your account settings
        </p>

      </div>

      {/* PROFILE CARD */}

      <div className="mt-8 bg-white/[0.05] border border-white/10 rounded-3xl p-8">

        <div className="flex items-center gap-5">

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center text-2xl font-black uppercase">

            {profile.name
              ?.split(" ")
              ?.map((word) => word[0])
              ?.join("")
              ?.slice(0, 2)}

          </div>

          <div>

            <h2 className="text-2xl font-bold">

              {profile.name}

            </h2>

            <p className="text-slate-400 mt-1">

              {profile.email}

            </p>

            <p className="text-cyan-400 text-sm mt-1 capitalize">

              {profile.role}

            </p>

          </div>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        {/* EDIT PROFILE */}

        <form
          onSubmit={handleProfileUpdate}
          className="bg-white/[0.05] border border-white/10 rounded-3xl p-6"
        >

          <div className="flex items-center gap-3 mb-6">

            <FaUser />

            <h2 className="font-bold text-xl">

              Edit Profile

            </h2>

          </div>

          <div className="space-y-4">

            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  name: e.target.value,
                })
              }
              placeholder="Full Name"
              className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-4 outline-none"
            />

            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email: e.target.value,
                })
              }
              placeholder="Email"
              className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-4 outline-none"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 font-bold"
            >

              <FaFloppyDisk className="inline mr-2" />

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </form>

        {/* CHANGE PASSWORD */}

        <form
          onSubmit={
            handlePasswordChange
          }
          className="bg-white/[0.05] border border-white/10 rounded-3xl p-6"
        >

          <div className="flex items-center gap-3 mb-6">

            <FaLock />

            <h2 className="font-bold text-xl">

              Change Password

            </h2>

          </div>

          <div className="space-y-4">

            <input
              type="password"
              placeholder="Current Password"
              value={
                passwordData.currentPassword
              }
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword:
                    e.target.value,
                })
              }
              className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-4 outline-none"
            />

            <input
              type="password"
              placeholder="New Password"
              value={
                passwordData.newPassword
              }
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword:
                    e.target.value,
                })
              }
              className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-4 outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={
                passwordData.confirmPassword
              }
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword:
                    e.target.value,
                })
              }
              className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-4 outline-none"
            />

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 font-bold"
            >

              {passwordLoading
                ? "Updating..."
                : "Change Password"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Profile;