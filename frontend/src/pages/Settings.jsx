import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { changePassword, updateAccountDetails, updateAvatar, updateCoverImage } from "../services/userService.js";

const Settings = () => {
  const { user, refresh } = useAuth();
  const [accountForm, setAccountForm] = useState({ fullname: user?.fullname || "", email: user?.email || "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleAccountChange = (event) => {
    setAccountForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handlePasswordChange = (event) => {
    setPasswordForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus("");
    try {
      await updateAccountDetails(accountForm);
      if (passwordForm.oldPassword && passwordForm.newPassword) {
        await changePassword(passwordForm);
      }
      if (avatarFile) {
        const avatarPayload = new FormData();
        avatarPayload.append("avatar", avatarFile);
        await updateAvatar(avatarPayload);
      }
      if (coverFile) {
        const coverPayload = new FormData();
        coverPayload.append("coverImage", coverFile);
        await updateCoverImage(coverPayload);
      }
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setAvatarFile(null);
      setCoverFile(null);
      setStatus("Settings updated.");
      refresh();
    } catch (error) {
      setStatus(error?.response?.data?.message || "Unable to update settings.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-semibold">Account settings</h1>
        <p className="mt-2 text-sm text-slate-400">Manage your profile details and security.</p>
        {status && <p className="mt-3 text-sm text-slate-400">{status}</p>}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Profile</h2>
            <Input name="fullname" value={accountForm.fullname} onChange={handleAccountChange} placeholder="Full name" />
            <Input name="email" type="email" value={accountForm.email} onChange={handleAccountChange} placeholder="Email" />
          </div>

          <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Change password</h2>
            <Input name="oldPassword" type="password" value={passwordForm.oldPassword} onChange={handlePasswordChange} placeholder="Current password" />
            <Input name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="New password" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Avatar</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setAvatarFile(event.target.files?.[0])}
              className="block w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-300"
            />
          </div>
          <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Cover image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setCoverFile(event.target.files?.[0])}
              className="block w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-300"
            />
          </div>
        </div>

        <Button type="submit">Update settings</Button>
      </form>
    </div>
  );
};

export default Settings;
