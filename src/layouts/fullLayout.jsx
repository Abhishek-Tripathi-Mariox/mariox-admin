import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const FullLayout = () => {
  return (
    <div className="admin-panel">
      <div className="container-fluid px-0">
        <div className="row no-gutters">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FullLayout;
