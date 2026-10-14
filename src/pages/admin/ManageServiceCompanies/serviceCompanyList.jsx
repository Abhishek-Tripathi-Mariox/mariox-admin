import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../../../components/deleteModal";
import {
  deleteServiceCompany,
  serviceCompanyList,
  storeCompanyFilters,
} from "./serviceCompanySlice";

const ServiceCompanyList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [id, setDeleteId] = useState("");

  const filter = useSelector((state) => state.serviceCompany.filters);
  const data = useSelector((state) => state.serviceCompany?.serviceCompanyList);
  const total = useSelector((state) => state.serviceCompany?.total);
  const [filters, setFilters] = useState(filter);

  useEffect(() => {
    setFilters(filter);
  }, [filter]);

  const getServiceCompanyListing = useCallback(() => {
    dispatch(serviceCompanyList(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(storeCompanyFilters(filters));
    getServiceCompanyListing();
  }, [filters, getServiceCompanyListing, dispatch]);

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleSearch = debounce((e) => {
    setFilters({ ...filters, page: 1, search: e.target.value });
  }, 300);

  const toggle = () => setModal(!modal);

  const deleteHandler = () => {
    dispatch(deleteServiceCompany({ filters, id })).then((res) => {
      if (res?.payload?.code === 1) {
        toggle();
        toast.success("Deleted successfully");
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        {/* ================= TOP HEADING ================== */}
        <div className="row align-items-center">
          <div className="col-md-6 mb-3">
            <h2 className="head-title">Service Company Types</h2>
          </div>

          {/* ================= ACTION BUTTONS ================== */}
          <div className="col-md-6 mb-3 d-flex justify-content-end align-items-center gap-2">
            <form className="has-search mr-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search by Query"
                onChange={handleSearch}
              />
            </form>

            {/* ⭐ FIXED GLOBAL SERVICES BUTTON */}
            <button
              onClick={() => navigate("/admin/manage-global-services")}
              className="btn btn-outline-primary"
              title="Manage Global Services"
              style={{ whiteSpace: "nowrap" }}
            >
              <img
                src="assets/images/services.png"
                alt="Services"
                style={{ width: "16px", marginRight: "6px" }}
              />
              Services
            </button>

            <Link to="/admin/manage-service-company/add" className="add-new">
              + Add New
            </Link>
          </div>
        </div>

        <hr />

        {/* ================= TABLE ================== */}
        <div className="table-responsive">
          <table className="table text-center">
            <thead>
              <tr>
                <th>Query</th>
                <th>Slug</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data && data.length > 0 ? (
                data.map((company) => (
                  <tr key={company._id}>
                    <td>{company.query}</td>
                    <td>{company.slug}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/manage-service-company/details/${company._id}`
                            )
                          }
                          className="btn"
                          title="View Details"
                        >
                          <img src="assets/images/view.png" alt="View" />
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/admin/manage-service-company/edit/${company._id}`
                            )
                          }
                          className="btn"
                          title="Edit"
                        >
                          <img src="assets/images/edit.png" alt="Edit" />
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/admin/manage-service-company-description/${company._id}`
                            )
                          }
                          className="btn"
                          title="Manage Description"
                        >
                          <img
                            src="assets/images/description.png"
                            alt="Description"
                          />
                        </button>

                        <button
                          onClick={() => {
                            setDeleteId(company._id);
                            toggle();
                          }}
                          className="btn"
                          title="Delete"
                        >
                          <img src="assets/images/delete.png" alt="Delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================== */}
        {total > filters.limit && (
          <Pagination
            activePage={filters.page}
            itemsCountPerPage={filters.limit}
            totalItemsCount={total}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        )}

        {/* ================= DELETE MODAL ================== */}
        <DeleteModal
          deleteCategory={deleteHandler}
          modal={modal}
          toggle={toggle}
        />
      </div>
    </article>
  );
};

export default ServiceCompanyList;
