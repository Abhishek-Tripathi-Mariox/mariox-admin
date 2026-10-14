import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import DeleteModal from "../../../components/deleteModal";
import {
  deleteCity,
  cityList,
  toggleCity,
  storeFilters,
  downloadCityList,
} from "./citySlice";
import { countryList } from "../ManageCountry/countrySlice";

const CityList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [id, setDeleteId] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filter = useSelector((state) => state.city.filters);
  const data = useSelector((state) => state.city?.cityList);
  const total = useSelector((state) => state.city?.total);
  const countries = useSelector((state) => state.country.countryList);

  const [filters, setFilters] = useState(filter);

  useEffect(() => {
    if (filter) setFilters(filter);
  }, [filter]);

  const getCityListing = useCallback(() => {
    dispatch(cityList(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    getCityListing();
  }, [getCityListing]);

  const handlePageChange = (page) => {
    const updated = { ...filters, page };
    dispatch(storeFilters(updated));
    setFilters(updated);
  };

  const handleSearch = debounce((e) => {
    const updated = { ...filters, page: 1, search: e.target.value };
    dispatch(storeFilters(updated));
    setFilters(updated);
  }, 300);

  const toggle = () => setModal(!modal);

  const deleteHandler = () => {
    dispatch(deleteCity({ filters, id })).then((res) => {
      if (res?.payload?.code === 1) {
        toggle();
        toast.success("Deleted successfully");
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const toggleTab = (isActive) => {
    const updated = { ...filters, isActive, page: 1 };
    dispatch(storeFilters(updated));
    setFilters(updated);
  };

  const handleToggle = (id) => {
    dispatch(toggleCity({ filters, id })).then((res) => {
      const { code, message } = res.payload;
      toast[code === 1 ? "success" : "error"](message);
    });
  };

  const loadCountryOptions = debounce((inputValue, callback) => {
    dispatch(countryList({ search: inputValue, page: 1, limit: 20 }))
      .then((res) => {
        const options =
          res?.payload?.countries?.map((country) => ({
            value: country._id,
            label: country.pageName,
          })) || [];
        callback(options);
      })
      .catch(() => callback([]));
  }, 300);

  const handleDownload = () => {
    const downloadParams = {
      search: filters.search || "",
      countryId: filters.countryId || "",
      fromDate: filters.fromDate || "",
      toDate: filters.toDate || "",
    };

    dispatch(downloadCityList(downloadParams));
  };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3">
            <div className="link-active">
              <img src="assets/images/Users-selected.png" alt="" />
              <span>
                <p>{total || 0}</p>
                <p>Total Cities</p>
              </span>
            </div>
          </div>

          <div className="col-md-6 mb-3 d-flex justify-content-end align-items-center position-relative">
            {/* Filter Icon Button */}
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <img src="/assets/images/filter.png" alt="Filter" width={20} />
            </button>

            {/* Download Button */}
            <button
              className="btn btn-outline-success ml-2"
              onClick={handleDownload}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3303/3303893.png"
                alt="Download"
                width={20}
                height={20}
                className="mr-2"
              />
              Download
            </button>

            {/* Add New Button */}
            <Link to="/admin/manage-cities/add" className="add-new ml-2">
              + Add New
            </Link>

            {/* Filter Dropdown */}
            {showFilters && (
              <div
                className="position-absolute bg-white border p-3 rounded shadow"
                style={{ top: "50px", right: 0, zIndex: 999, width: 300 }}
              >
                <label className="form-label">Country</label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadCountryOptions}
                  placeholder="Country"
                  isClearable
                  value={
                    filters.countryId
                      ? {
                          value: filters.countryId,
                          label:
                            countries.find((c) => c._id === filters.countryId)
                              ?.pageName || "Selected Country",
                        }
                      : null
                  }
                  onChange={(selected) => {
                    const updated = {
                      ...filters,
                      countryId: selected?.value || "",
                      page: 1,
                    };
                    dispatch(storeFilters(updated));
                    setFilters(updated);
                  }}
                />

                <label className="form-label mt-3">From Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.fromDate || ""}
                  onChange={(e) => {
                    const updated = {
                      ...filters,
                      fromDate: e.target.value,
                      page: 1,
                    };
                    dispatch(storeFilters(updated));
                    setFilters(updated);
                  }}
                />

                <label className="form-label mt-3">To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.toDate || ""}
                  onChange={(e) => {
                    const updated = {
                      ...filters,
                      toDate: e.target.value,
                      page: 1,
                    };
                    dispatch(storeFilters(updated));
                    setFilters(updated);
                  }}
                />

                <label className="form-label mt-3">Limit</label>
                <select
                  className="form-control"
                  value={filters.limit}
                  onChange={(e) => {
                    const updated = {
                      ...filters,
                      limit: Number(e.target.value),
                      page: 1,
                    };
                    dispatch(storeFilters(updated));
                    setFilters(updated);
                  }}
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>

                <label className="form-label mt-3">Search</label>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search City"
                  onChange={handleSearch}
                />
              </div>
            )}
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            <ul className="nav nav-tabs group-nav">
              <li className="nav-item">
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
              </li>
            </ul>

            <div className="table-responsive mt-3">
              <table className="table text-center">
                <thead>
                  <tr>
                    <th>City Name</th>
                    <th>Slug</th>
                    <th>Country</th>
                    <th>Top City</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.length > 0 ? (
                    data.map((city) => (
                      <tr key={city._id}>
                        <td>{city.pageName}</td>
                        <td>{city.slug}</td>
                        <td>{city.country?.pageName || "N/A"}</td>
                        <td>{city.isTopCity ? "Yes" : "No"}</td>
                        <td>
                          <button className="btn">
                            <input
                              checked={city.status}
                              onChange={() => handleToggle(city._id)}
                              type="checkbox"
                              className="toggle"
                            />
                          </button>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/manage-cities/details/${city._id}`
                                )
                              }
                              className="btn"
                            >
                              <img src="assets/images/view.png" alt="" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/manage-cities/edit/${city._id}`
                                )
                              }
                              className="btn"
                            >
                              <img src="assets/images/edit.png" alt="" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(city._id);
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
                      <td colSpan={6}>No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {total > filters.limit && (
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

export default CityList;
