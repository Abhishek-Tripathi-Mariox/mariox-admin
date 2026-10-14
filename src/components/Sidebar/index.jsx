import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { router } from "../../routes";

// need to uncomment
import { storeFilters } from "../../pages/admin/ManageCountry/countrySlice";
const Sidebar = () => {
  const { pathname } = useLocation();
  console.log(pathname, "Pathname", pathname?.slice(1));
  const dispatch = useDispatch();
  const History = useNavigate();
  const [activeIndex, setActiveIndex] = useState(pathname?.slice(1));
  const [topNav, setTopNav] = useState(false);
  const toggle = () => {
    setTopNav(!topNav);
  };

  useEffect(() => {
    let currentlyOpenedDropdown = router.find((it) =>
      pathname?.includes(it?.state)
    );
    if (currentlyOpenedDropdown) {
      setActiveIndex(currentlyOpenedDropdown?.state);
    } else {
      setActiveIndex(router?.[0]?.path);
    }
  }, [pathname]);

  return (
    <div className="col-lg-3 store-sidebar admin-sidebar">
      <div className="shadow-part">
        <Link
          className="navbar-brand bg-none px-3 mx-lg-auto d-lg-block"
          href="index.html"
        >
          <img alt="" src="assets/images/favicon.ico" className="img-fluid" />
        </Link>
        <button
          onClick={toggle}
          className="btn btn-blue float-right menu-toggle d-lg-none"
          data-target="#sidebar"
          data-toggle="collapse"
        >
          {" "}
          <i className="fa fa-bars"></i>
        </button>
        <nav
          className={" collapse d-lg-block " + (topNav ? "show" : "")}
          id="sidebar"
        >
          <ul className="list-unstyled mb-0">
            {router.map((prop, i) => {
              if (prop.hidden) {
                return false;
              } else if (prop.collapse) {
                return (
                  <li key={i}>
                    <Link
                      className={activeIndex === prop.state ? "active" : ""}
                      to="#"
                      onClick={() => {
                        setActiveIndex(prop.state);
                      }}
                    >
                      <div>
                        <img
                          src={prop.img1}
                          alt=""
                          className="img-fluid sidebar-icon inactive-icon"
                        />
                        <img
                          src={prop.img2}
                          alt=""
                          className="img-fluid sidebar-icon active-icon"
                        />
                      </div>
                      <span>{prop.name} </span>
                    </Link>
                    <div
                      className={
                        "collapse-border " +
                        (activeIndex === prop.state ? "" : "collapse")
                      }
                      id="category"
                    >
                      {prop.child.map((propChild, i) => {
                        if (propChild.hidden) {
                          return false;
                        } else if (propChild.name === "Logout") {
                          return (
                            <Link
                              onClick={() => {
                                Cookies.remove();
                                History("/auth");
                              }}
                              to={propChild.path}
                              key={i}
                            >
                              {propChild.name}
                            </Link>
                          );
                        } else
                          return (
                            // eslint-disable-next-line react/jsx-key
                            <Link
                              className={
                                pathname.includes(propChild.path)
                                  ? "active"
                                  : ""
                              }
                              onClick={toggle}
                              to={propChild.path}
                            >
                              {propChild.name}
                            </Link>
                          );
                      })}
                    </div>
                  </li>
                );
              } else {
                return (
                  <li key={i}>
                    <Link
                      onClick={() => {
                        setActiveIndex("");
                        toggle();
                        if (prop.name.toLowerCase() === "manage countries") {
                          (async () => {
                            await localStorage.setItem(
                              "filters",
                              JSON.stringify({
                                page: 1,
                                limit: 10,
                                isActive: true,
                                search: "",
                                categoryId: "",
                                subCategoryId: "",
                                startDate: "",
                                endDate: "",
                              })
                            );
                          })();

                          dispatch(
                            storeFilters({
                              page: 1,
                              limit: 10,
                              isActive: true,
                              search: "",
                              categoryId: "",
                              subCategoryId: "",
                              startDate: "",
                              endDate: "",
                            })
                          );
                        }
                      }}
                      className={pathname.startsWith(prop.path) ? "active" : ""}
                      to={prop.path}
                    >
                      <div>
                        <img
                          src={prop.img1}
                          alt=""
                          className="img-fluid sidebar-icon inactive-icon"
                        />
                        <img
                          src={prop.img2}
                          alt=""
                          className="img-fluid sidebar-icon active-icon"
                        />
                      </div>
                      <span>{prop.name} </span>
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
