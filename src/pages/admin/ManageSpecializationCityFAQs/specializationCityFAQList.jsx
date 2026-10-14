import { debounce } from "lodash";
import { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import DeleteModal from "../../../components/deleteModal";

import {
  specializationCityFAQList,
  deleteSpecializationCityFAQs,
  toggleSpecializationCityFAQs,
  storeFilters,
} from "./specializationCityFAQSlice";
import { cityList } from "../ManageCity/citySlice";
import { specializationList } from "../ManageServices/serviceSlice";
import { countryList } from "../ManageCountry/countrySlice";

const SpecializationCityFAQList = () => {
  const truncateWords = (str, wordLimit = 5) => {
    if (!str) return "";
    const words = str.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : str;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");

  const storedFilters = useSelector(
    (state) => state.specializationCityFAQ.filters
  );
  const faqList = useSelector(
    (state) => state.specializationCityFAQ.specializationCityFAQList
  );
  const total = useSelector((state) => state.specializationCityFAQ.total);
  // const countries = useSelector((state) => state.country.countryList);
  // const cities = useSelector((state) => state.city.cityList);
  const specializations = useSelector(
    (state) => state.service.specializationList
  );

  console.log("specializations=>>", specializations);

  const [filters, setFilters] = useState(storedFilters);

  useEffect(() => {
    dispatch(countryList());
    dispatch(specializationList({ page: 1, limit: 100 }));

    if (filters.countryId) {
      dispatch(cityList({ page: 1, limit: 50, countryId: filters.countryId }));
    }
  }, [dispatch, filters.countryId]);

  useEffect(() => {
    dispatch(storeFilters(filters));
    dispatch(specializationCityFAQList(filters));
  }, [filters, dispatch]);

  const handleSearch = debounce((e) => {
    const updated = { ...filters, search: e.target.value, page: 1 };
    setFilters(updated);
  }, 300);

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (e) => {
    const updated = {
      ...filters,
      limit: Number(e.target.value),
      page: 1,
    };
    dispatch(storeFilters(updated));
    setFilters(updated);
  };

  const toggleStatus = (id) => {
    dispatch(toggleSpecializationCityFAQs({ id, filters })).then((res) => {
      const { code, message } = res.payload || {};
      toast[code === 1 ? "success" : "error"](message || "Toggle failed");
    });
  };

  const deleteHandler = () => {
    dispatch(deleteSpecializationCityFAQs({ id: idToDelete, filters })).then(
      (res) => {
        if (res?.payload?.code === 1) {
          toggleModal();
          toast.success("FAQ deleted successfully");
        } else {
          toast.error(res?.payload?.message || "Delete failed");
        }
      }
    );
  };

  const toggleModal = () => setModal((prev) => !prev);

  const toggleTab = (isActive) => {
    setFilters((prev) => ({ ...prev, isActive, page: 1 }));
  };

  // const handleCountryChange = (selected) => {
  //   const updated = {
  //     ...filters,
  //     countryId: selected?.value || "",
  //     cityId: "",
  //     page: 1,
  //   };
  //   setFilters(updated);

  //   if (selected?.value) {
  //     dispatch(cityList({ page: 1, limit: 50, countryId: selected.value }));
  //   }
  // };

  // const handleCityChange = (selected) => {
  //   const updated = {
  //     ...filters,
  //     cityId: selected?.value || "",
  //     page: 1,
  //   };
  //   setFilters(updated);
  // };

  const handleSpecializationChange = (selected) => {
    const updated = {
      ...filters,
      specializationId: selected?.value || "",
      page: 1,
    };
    setFilters(updated);
  };

  // const handleCitySearch = useCallback(
  //   debounce((inputValue) => {
  //     if (filters.countryId && inputValue) {
  //       dispatch(
  //         cityList({
  //           search: inputValue,
  //           page: 1,
  //           limit: 50,
  //           countryId: filters.countryId,
  //         })
  //       );
  //     }
  //   }, 300),
  //   [dispatch, filters.countryId]
  // );

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        {/* 🔽 Header */}
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="link-active">
              <img src="assets/images/Users-selected.png" alt="" />
              <span>
                <p>{total || 0}</p>
                <p>Total Service City FAQs</p>
              </span>
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-end align-items-center flex-wrap gap-2">
            {/* <div className="col-md-6 d-flex justify-content-end align-items-center"> */}
            {/* <Select
              placeholder="Country"
              isClearable
              isSearchable
              value={
                countries.find((c) => c._id === filters.countryId)
                  ? {
                      label: countries.find((c) => c._id === filters.countryId)
                        ?.pageName,
                      value: filters.countryId,
                    }
                  : null
              }
              onChange={handleCountryChange}
              options={countries.map((c) => ({
                value: c._id,
                label: c.pageName,
              }))}
              className="mr-2"
              styles={{ container: (base) => ({ ...base, width: 200 }) }}
            />

            <Select
              placeholder="City"
              isClearable
              isSearchable
              onInputChange={handleCitySearch}
              value={
                cities.find((c) => c._id === filters.cityId)
                  ? {
                      label: cities.find((c) => c._id === filters.cityId)
                        ?.pageName,
                      value: filters.cityId,
                    }
                  : null
              }
              onChange={handleCityChange}
              options={cities.map((city) => ({
                value: city._id,
                label: city.pageName,
              }))}
              className="mr-2"
              styles={{ container: (base) => ({ ...base, width: 200 }) }}
            /> */}

            <select
              className="form-control"
              value={filters.limit}
              onChange={handleLimitChange}
              style={{ width: 140, height: 40 }}
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>

            <Select
              placeholder="Service"
              isClearable
              isSearchable
              value={
                specializations.find((s) => s._id === filters.specializationId)
                  ? {
                      label: specializations.find(
                        (s) => s._id === filters.specializationId
                      )?.pageName,
                      value: filters.specializationId,
                    }
                  : null
              }
              onChange={handleSpecializationChange}
              options={specializations.map((spec) => ({
                value: spec._id,
                label: spec.pageName,
              }))}
              className="mr-2"
              styles={{ container: (base) => ({ ...base, width: 220 }) }}
            />

            <form className="has-search mr-2" style={{ width: 200 }}>
              <input
                type="search"
                className="form-control"
                placeholder="Search by Question"
                onChange={handleSearch}
              />
            </form>

            <Link
              to="/admin/manage-specializations-city-faqs/add"
              className="add-new"
            >
              + Add New
            </Link>
          </div>
        </div>

        {/* 🔽 Tabs */}
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

        {/* 🔽 Table */}
        <div className="table-responsive mt-3">
          <table className="table text-center">
            <thead>
              <tr>
                <th>Service</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {faqList?.length > 0 ? (
                faqList.map((faq) => (
                  <tr key={faq._id}>
                    <td>{faq.specialization || "-"}</td>
                    {/* <td>{faq.question}</td> */}
                    <td>{truncateWords(faq.question)}</td>
                    <td>{truncateWords(faq.answer)}</td>
                    <td>
                      <input
                        type="checkbox"
                        className="toggle"
                        checked={faq.status}
                        onChange={() => toggleStatus(faq._id)}
                      />
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn"
                          onClick={() =>
                            navigate(
                              `/admin/manage-specializations-city-faqs/details/${faq._id}`
                            )
                          }
                        >
                          <img src="assets/images/view.png" alt="View" />
                        </button>
                        <button
                          className="btn"
                          onClick={() =>
                            navigate(
                              `/admin/manage-specializations-city-faqs/edit/${faq._id}`
                            )
                          }
                        >
                          <img src="assets/images/edit.png" alt="Edit" />
                        </button>
                        <button
                          className="btn"
                          onClick={() => {
                            setIdToDelete(faq._id);
                            toggleModal();
                          }}
                        >
                          <img src="assets/images/delete.png" alt="Delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No FAQs found</td>
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

export default SpecializationCityFAQList;
