// import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../../../components/deleteModal";
import {
  deleteServiceImage,
  serviceCityImageList,
  // toggleServiceImage,
  storeFilters,
} from "./serviceCityContentSlice";

const ServiceList = () => {
  const getPlainText = (html, wordLimit = 15) => {
    const plainText = html.replace(/<[^>]+>/g, ""); // strip HTML
    return plainText.split(" ").slice(0, wordLimit).join(" ") + "...";
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [id, setDeleteId] = useState("");

  const filter = useSelector((state) => state.serviceCityContent.filters);
  const data = useSelector((state) => {
    return state.serviceCityContent?.serviceCityImageList;
  });
  const total = useSelector((state) => state.serviceCityContent?.total);
  const [filters, setFilters] = useState(filter);

  useEffect(() => {
    setFilters(filter);
  }, [filter]);

  const getServiceListing = useCallback(() => {
    dispatch(serviceCityImageList(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(storeFilters(filters));
    getServiceListing();
  }, [filters, getServiceListing, dispatch]);

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  // const handleSearch = debounce((e) => {
  //   setFilters({ ...filters, page: 1, search: e.target.value });
  // }, 300);

  const toggle = () => setModal(!modal);

  const deleteHandler = () => {
    dispatch(deleteServiceImage({ filters, id })).then((res) => {
      if (res?.payload?.code === 1) {
        toggle();
        toast.success("Deleted successfully");
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  // const toggleTab = (isActive) => {
  //   setFilters({ ...filters, isActive, page: 1 });
  // };

  // const handleToggle = (id) => {
  //   dispatch(toggleServiceImage({ filters, id })).then((res) => {
  //     const { code, message } = res.payload;
  //     toast[code === 1 ? "success" : "error"](message);
  //   });
  // };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3">
            <div className="link-active">
              <img src="assets/images/Users-selected.png" alt="" />
              <span>
                <p>{total || 0}</p>
                <p>Total Service Content</p>
              </span>
            </div>
          </div>
          <div className="col-md-6 mb-3 d-flex justify-content-end">
            <form className="has-search mr-3">
              {/* <input
                type="search"
                className="form-control"
                placeholder="Search Service by Name"
                onChange={handleSearch}
              /> */}
            </form>
            <Link
              to="/admin/manage-service-cities-content/add"
              className="add-new"
            >
              + Add New
            </Link>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            <ul className="nav nav-tabs group-nav">
              {/* <li className="nav-item">
                <Link
                  className={`nav-link ${filters.isActive ? "active" : ""}`}
                  to="#"
                  onClick={() => toggleTab(true)}
                >
                  Active
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${!filters.isActive ? "active" : ""}`}
                  to="#"
                  onClick={() => toggleTab(false)}
                >
                  Inactive
                </Link>
              </li> */}
            </ul>

            <div className="d-flex justify-content-end align-items-center my-3">
              {/* <DateFilterModal dateHandler={dateHandler} /> */}
            </div>

            <div className="table-responsive">
              <table className="table text-center">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Image</th>
                    {/* <th>Status</th> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.length > 0 ? (
                    data.map((service) => (
                      <tr key={service._id}>
                        <td>{service.serviceName}</td>
                        <td>{service.title}</td>
                        <td>{getPlainText(service.content)}</td>
                        <td>
                          <img
                            src={service.image}
                            alt="service"
                            style={{
                              width: "60px",
                              height: "auto",
                              objectFit: "contain",
                            }}
                          />
                        </td>

                        {/* <td>
                          <button className="btn">
                            <input
                              checked={service.status}
                              onChange={() => handleToggle(service._id)}
                              type="checkbox"
                              className="toggle"
                            />
                          </button>
                        </td> */}
                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/manage-service-cities-content/details/${service._id}`
                                )
                              }
                              className="btn"
                            >
                              <img src="assets/images/view.png" alt="" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/manage-service-cities-content/edit/${service._id}`
                                )
                              }
                              className="btn"
                            >
                              <img src="assets/images/edit.png" alt="" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(service._id);
                                toggle();
                              }}
                              className="btn"
                            >
                              <img src="assets/images/delete.png" alt="" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {total > 10 && (
              <Pagination
                activePage={filters.page}
                itemsCountPerPage={filters.limit}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
              />
            )}

            <DeleteModal
              deleteCategory={deleteHandler}
              modal={modal}
              toggle={toggle}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceList;
