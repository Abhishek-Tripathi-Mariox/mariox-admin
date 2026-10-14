import Cookies from "js-cookie";
import { useEffect } from "react";
import { Outlet } from "react-router";

const BlankLayout = () => {
  useEffect(() => {
    Cookies.remove();
  }, []);

  return (
    <>
      <Outlet />;
    </>
  );
};

export default BlankLayout;
