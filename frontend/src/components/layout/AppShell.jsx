import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

const AppShell = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthRoute) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl gap-0">
        <Sidebar />
        <main className="flex-1 px-6 py-6 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
