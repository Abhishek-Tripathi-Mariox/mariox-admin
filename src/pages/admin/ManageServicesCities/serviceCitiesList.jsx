import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";
import { toast } from "react-toastify";
import Select from "react-select";
import AsyncSelect from "react-select/async";

import DeleteModal from "../../../components/deleteModal";
import {
  specializationCityList,
  deleteSpecializationCity,
  toggleSpecializationCity,
  storeFilters,
  downloadSpecializationCityList,
} from "./serviceCitiesSlice";
import { cityList } from "../ManageCity/citySlice";
import { countryList } from "../ManageCountry/countrySlice";
import { specializationList } from "../ManageServices/serviceSlice";

const ServiceCityList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [id, setDeleteId] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtersFromStore = useSelector((state) => state.serviceCity.filters);
  const data = useSelector((state) => state.serviceCity.specializationCityList);
  const total = useSelector((state) => state.serviceCity.total);
  const countries = useSelector((state) => state.country.countryList);
  const cities = useSelector((state) => state.city.cityList);
  const services = useSelector((state) => state.service.specializationList);

  const [filters, setFilters] = useState(
    filtersFromStore || { page: 1, limit: 10, serviceSlug: "" }
  );

  useEffect(() => {
    dispatch(specializationList({ page: 1, limit: 100 }));
  }, [dispatch]);

  const fetchList = useCallback(() => {
    dispatch(storeFilters(filters));
    dispatch(specializationCityList(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handlePageChange = (page) => {
    const updated = { ...filters, page };
    setFilters(updated);
    dispatch(storeFilters(updated));
  };

  const handleSearch = debounce((e) => {
    const updated = { ...filters, search: e.target.value, page: 1 };
    setFilters(updated);
    dispatch(storeFilters(updated));
    dispatch(specializationCityList(updated));
  }, 300);

  const loadCountries = async (inputValue, callback) => {
    const res = await dispatch(
      countryList({ search: inputValue, page: 1, limit: 10 })
    );

    const options = (res?.payload?.countries || []).map((c) => ({
      label: c.pageName,
      value: c._id,
    }));
    callback(options);
  };

  const handleCountryChange = (selected) => {
    const updated = {
      ...filters,
      countryId: selected?.value || "",
      cityId: "",
      page: 1,
    };
    setFilters(updated);
    dispatch(storeFilters(updated));
    if (selected?.value) {
      dispatch(cityList({ page: 1, limit: 10, countryId: selected.value }));
    }
    dispatch(specializationCityList(updated));
  };

  const loadCities = async (inputValue, callback) => {
    if (!filters.countryId) return callback([]);
    const res = await dispatch(
      cityList({
        search: inputValue,
        page: 1,
        limit: 10,
        countryId: filters.countryId,
      })
    );

    const options = (res?.payload?.countries || []).map((c) => ({
      label: c.pageName,
      value: c._id,
    }));
    callback(options);
  };

  const handleCityChange = (selected) => {
    const updated = { ...filters, cityId: selected?.value || "", page: 1 };
    setFilters(updated);
    dispatch(storeFilters(updated));
    dispatch(specializationCityList(updated));
  };

  const handleServiceChange = (selected) => {
    const updated = {
      ...filters,
      serviceId: selected?.value || "",
      page: 1,
    };
    setFilters(updated);
    dispatch(storeFilters(updated));
    dispatch(specializationCityList(updated));
  };

  const handleToggle = (id) => {
    dispatch(toggleSpecializationCity({ filters, id })).then((res) => {
      toast[res.payload.code === 1 ? "success" : "error"](res.payload.message);
    });
  };

  const toggleModal = () => setModal(!modal);

  const deleteHandler = () => {
    dispatch(deleteSpecializationCity({ filters, id })).then((res) => {
      if (res?.payload?.code === 1) {
        toggleModal();
        toast.success("Deleted successfully");
      } else {
        toast.error(res?.payload?.message || "Delete failed");
      }
    });
  };

  const handleDownload = () => {
    const downloadParams = {
      search: filters.search || "",
      countryId: filters.countryId || "",
      cityId: filters.cityId || "",
      serviceId: filters.serviceId || "",
      fromDate: filters.fromDate || "",
      toDate: filters.toDate || "",
    };
    dispatch(downloadSpecializationCityList(downloadParams));
  };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Total Service Cities: {total}</h5>
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <img src="/assets/images/filter.png" alt="Filter" width={20} />
            </button>
            <button
              className="btn btn-outline-success mx-2"
              onClick={handleDownload}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3303/3303893.png"
                alt="Download"
                width={20}
                height={20}
              />
              Download
            </button>
            <Link to="/admin/manage-serviceCities/add" className="add-new">
              + Add New
            </Link>
          </div>
        </div>

        {showFilters && (
          <div className="row mb-3">
            <div className="col-md-3">
              <AsyncSelect
                placeholder="Search Country"
                cacheOptions
                defaultOptions
                loadOptions={loadCountries}
                isClearable
                value={
                  filters.countryId
                    ? {
                        label: countries.find(
                          (c) => c._id === filters.countryId
                        )?.pageName,
                        value: filters.countryId,
                      }
                    : null
                }
                onChange={handleCountryChange}
              />
            </div>

            <div className="col-md-3">
              <AsyncSelect
                placeholder="Search City"
                isDisabled={!filters.countryId}
                cacheOptions
                defaultOptions
                loadOptions={loadCities}
                isClearable
                value={
                  filters.cityId
                    ? {
                        label: cities.find((c) => c._id === filters.cityId)
                          ?.pageName,
                        value: filters.cityId,
                      }
                    : null
                }
                onChange={handleCityChange}
              />
            </div>

            <div className="col-md-3">
              <Select
                placeholder="Service"
                isClearable
                isSearchable
                value={
                  services.find((s) => s._id === filters.serviceId)
                    ? {
                        label: services.find((s) => s._id === filters.serviceId)
                          ?.pageName,
                        value: filters.serviceId,
                      }
                    : null
                }
                onChange={handleServiceChange}
                options={services.map((s) => ({
                  value: s._id,
                  label: s.pageName,
                }))}
              />
            </div>

            <div className="col-md-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
                onChange={handleSearch}
              />
            </div>

            <div className="col-md-3 mt-3">
              <label>From Date</label>
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
                  setFilters(updated);
                  dispatch(storeFilters(updated));
                }}
              />
            </div>

            <div className="col-md-3 mt-3">
              <label>To Date</label>
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
                  setFilters(updated);
                  dispatch(storeFilters(updated));
                }}
              />
            </div>
          </div>
        )}

        <div className="table-responsive mt-3">
          <table className="table text-center">
            <thead>
              <tr>
                <th>Service</th>
                <th>City</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.serviceName || "-"}</td>
                    <td>{item.cityName || "-"}</td>
                    <td>{item.slug}</td>
                    <td>
                      <input
                        type="checkbox"
                        className="toggle"
                        checked={item.status}
                        onChange={() => handleToggle(item._id)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn"
                        onClick={() =>
                          navigate(
                            `/admin/manage-serviceCities/details/${item._id}`
                          )
                        }
                      >
                        <img src="assets/images/view.png" alt="View" />
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          setDeleteId(item._id);
                          toggleModal();
                        }}
                      >
                        <img src="assets/images/delete.png" alt="Delete" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No service mappings found</td>
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
          toggle={toggleModal}
        />
      </div>
    </article>
  );
};

export default ServiceCityList;
