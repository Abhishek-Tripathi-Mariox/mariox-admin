import Cookies from "js-cookie";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
export const PrivateRoute = () => {
  const isAuthenticated = Cookies.get("t_k") || false;
  const { pathname } = useLocation();

  useEffect(() => {
    return () => {
      window.addEventListener("popstate", (e) => {
        const targetLocation = e.target.location.pathname;
        // URL changed!
        if (targetLocation !== pathname) {
          Cookies.remove("t_k");
        }
      });
    };
  }, [pathname]);

  return isAuthenticated ? (
    <div className="admin-panel">
      <div className="container-fluid px-0">
        <div className="row no-gutters">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/auth/login" />
  );
};
