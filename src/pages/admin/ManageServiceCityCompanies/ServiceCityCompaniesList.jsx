import { useEffect, useState, useCallback } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import DeleteModal from "../../../components/deleteModal";
import {
  getServiceCityCompanyList,
  storeFilters,
  deleteServiceCityCompany,
  deleteMultipleServiceCityCompanies,
} from "./serviceCityCompaniesSlice";
import "./ServiceCityCompaniesList.css";

const ServiceCityCompaniesList = () => {
  const dispatch = useDispatch();
  const { list, total, filters } = useSelector(
    (state) => state.serviceCityCompany
  );

  const [localFilters, setLocalFilters] = useState(filters);
  const [selected, setSelected] = useState(null);

  // Single delete states
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  // Bulk delete states
  const [bulkModal, setBulkModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const toggleBulkModal = () => setBulkModal(!bulkModal);

  const fetchList = useCallback(() => {
    dispatch(getServiceCityCompanyList(localFilters));
  }, [dispatch, localFilters]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handlePageChange = (page) => {
    const updated = { ...localFilters, page };
    dispatch(storeFilters(updated));
    setLocalFilters(updated);
  };

  const handleSearch = debounce((e) => {
    const updated = { ...localFilters, page: 1, search: e.target.value };
    dispatch(storeFilters(updated));
    setLocalFilters(updated);
  }, 400);

  // ✅ Single Delete
  const handleDelete = () => {
    dispatch(deleteServiceCityCompany({ id: deleteId, filters: localFilters }))
      .then((res) => {
        if (res?.payload?.code === 1) {
          toast.success("Deleted successfully");
          toggleDeleteModal();
          fetchList();
        } else {
          toast.error(res?.payload?.message || "Failed to delete");
        }
      })
      .catch(() => toast.error("Error deleting record"));
  };

  // ✅ Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one record");
      return;
    }

    dispatch(
      deleteMultipleServiceCityCompanies({
        ids: selectedIds,
        filters: localFilters,
      })
    )
      .then((res) => {
        if (res?.payload?.code === 1) {
          toast.success(res?.payload?.message || "Deleted successfully");
          setSelectedIds([]);
          toggleBulkModal();
          fetchList();
        } else {
          toast.error(res?.payload?.message || "Failed to delete");
        }
      })
      .catch(() => toast.error("Error deleting records"));
  };

  // ✅ Handle select all checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(list.map((item) => item._id));
    } else {
      setSelectedIds([]);
    }
  };

  // ✅ Handle individual checkbox toggle
  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="head-title">Service-City Companies</h2>
          <div className="d-flex gap-2">
            {selectedIds.length > 0 && (
              <button className="btn btn-danger" onClick={toggleBulkModal}>
                Delete Selected ({selectedIds.length})
              </button>
            )}
            <Link
              to="/admin/manage-service-city-companies/add"
              className="add-new"
            >
              + Add New
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="search"
            className="form-control"
            placeholder="Search service or city"
            onChange={handleSearch}
          />
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table text-center">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === list.length && list.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Query</th>
                <th>Slug</th>
                <th>Total Companies</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list?.length > 0 ? (
                list.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id)}
                        onChange={() => handleSelectOne(item._id)}
                      />
                    </td>
                    <td>{item.query}</td>
                    <td>{item.slug}</td>
                    <td>{item.companies?.length}</td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>{new Date(item.updatedAt).toLocaleString()}</td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => setSelected(item)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setDeleteId(item._id);
                            toggleDeleteModal();
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > localFilters.limit && (
          <Pagination
            activePage={localFilters.page}
            itemsCountPerPage={localFilters.limit}
            totalItemsCount={total}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        )}
      </div>

      {/* =================== 🪟 Detail Popup =================== */}
      {selected && (
        <div className="custom-modal-overlay" onClick={() => setSelected(null)}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Companies for: {selected.query}</h5>
              <button
                className="btn btn-close"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {selected.companies?.map((company, idx) => (
                <div key={company._id || idx} className="company-card">
                  <div className="d-flex align-items-center mb-2">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="company-logo"
                      />
                    ) : (
                      <div className="company-logo-placeholder">🏢</div>
                    )}
                    <div className="ms-2">
                      <h6 className="mb-0">
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {company.name}
                        </a>
                      </h6>
                      <small className="text-muted">
                        {company.rating} | Founded: {company.founded}
                      </small>
                    </div>
                  </div>

                  <p className="mb-1">{company.description}</p>

                  <div className="d-flex flex-wrap small mb-2">
                    <span className="me-3">
                      <b>Employees:</b> {company.employees}
                    </span>
                    <span className="me-3">
                      <b>Rate:</b> {company.hourly_rate}
                    </span>
                    <span className="me-3">
                      <b>Email:</b> {company.email}
                    </span>
                    <span className="me-3">
                      <b>Phone:</b> {company.phone}
                    </span>
                  </div>

                  {company.services?.length > 0 && (
                    <div className="small text-muted mb-3">
                      <b>Services:</b> {company.services.join(", ")}
                    </div>
                  )}

                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================== 🗑 Delete Confirmation Modals =================== */}
      <DeleteModal
        deleteCategory={handleDelete}
        modal={deleteModal}
        toggle={toggleDeleteModal}
      />

      <DeleteModal
        deleteCategory={handleBulkDelete}
        modal={bulkModal}
        toggle={toggleBulkModal}
      />
    </article>
  );
};

export default ServiceCityCompaniesList;
