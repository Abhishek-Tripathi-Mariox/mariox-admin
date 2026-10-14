import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../../../components/deleteModal";

import {
  serviceCompanyDescriptionList,
  deleteServiceCompanyDescription,
  toggleServiceCompanyDescription,
  storeCompanyDescriptionFilters,
} from "./serviceCompanyDescriptionSlice";

const ManageServiceCompanyDescription = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serviceCompanyId } = useParams();

  const [modal, setModal] = useState(false);
  const [id, setDeleteId] = useState("");

  const savedFilters =
    useSelector((s) => s.serviceCompanyDescription?.filters) || {};

  const data = useSelector(
    (state) => state.serviceCompanyDescription?.serviceCompanyDescriptionList
  );
  const total = useSelector((state) => state.serviceCompanyDescription?.total);

  // ✅ Local filters state (guarantee serviceCompanyId is always included)
  const [filters, setFilters] = useState({
    ...savedFilters,
    serviceCompanyId,
  });

  // ✅ Controlled search input state
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Reset search on first page entry
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      page: 1,
      serviceCompanyId,
    }));
    setSearchTerm("");
  }, [serviceCompanyId]);

  // ✅ Fetch listing function
  const getDescriptionListing = useCallback(() => {
    dispatch(serviceCompanyDescriptionList(filters));
  }, [dispatch, filters]);

  // ✅ Trigger API whenever filters change
  useEffect(() => {
    dispatch(storeCompanyDescriptionFilters(filters));
    getDescriptionListing();
  }, [filters, getDescriptionListing, dispatch]);

  // ✅ Pagination change
  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
      serviceCompanyId,
    }));
  };

  // ✅ Debounced Search
  const handleSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({
        ...prev,
        search: value,
        page: 1,
        serviceCompanyId,
      }));
    }, 300),
    [serviceCompanyId]
  );

  const toggle = () => setModal(!modal);

  const deleteHandler = () => {
    dispatch(deleteServiceCompanyDescription({ id, filters })).then((res) => {
      if (res?.payload?.code === 1) {
        toggle();
        toast.success("Deleted successfully");
      } else {
        toast.error(res?.payload?.message || "Failed to delete");
      }
    });
  };

  const toggleTab = (isActive) => {
    setFilters((prev) => ({
      ...prev,
      isActive,
      page: 1,
      serviceCompanyId,
    }));
  };

  const handleToggle = (id) => {
    dispatch(toggleServiceCompanyDescription({ id, filters })).then((res) => {
      const { code, message } = res?.payload || {};
      toast[code === 1 ? "success" : "error"](message || "Action failed");
    });
  };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3">
            <div className="link-active">
              <img src="/assets/images/Users-selected.png" alt="" />
              <span>
                <p>{total || 0}</p>
                <p>Total Descriptions</p>
              </span>
            </div>
          </div>

          <div className="col-md-6 mb-3 d-flex justify-content-end">
            <form className="has-search mr-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search Description"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </form>

            <Link
              to={`/admin/manage-service-company-description/add/${serviceCompanyId}`}
              className="add-new"
            >
              + Add New
            </Link>
          </div>
        </div>

        <hr />

        {/* Active / Inactive */}
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
                <th>Description</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data && data.length > 0 ? (
                data.map((desc) => (
                  <tr key={desc._id}>
                    <td>
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            (desc.description || "").substring(0, 80) + "...",
                        }}
                      />
                    </td>

                    <td>
                      <input
                        checked={desc.status}
                        onChange={() => handleToggle(desc._id)}
                        type="checkbox"
                        className="toggle"
                      />
                    </td>

                    <td>{new Date(desc.createdAt).toLocaleDateString()}</td>

                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/manage-service-company-description/details/${desc._id}`
                            )
                          }
                          className="btn"
                        >
                          <img src="/assets/images/view.png" alt="View" />
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/admin/manage-service-company-description/edit/${desc._id}/${serviceCompanyId}`
                            )
                          }
                          className="btn"
                        >
                          <img src="/assets/images/edit.png" alt="Edit" />
                        </button>

                        <button
                          onClick={() => {
                            setDeleteId(desc._id);
                            toggle();
                          }}
                          className="btn"
                        >
                          <img src="/assets/images/delete.png" alt="Delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No data found</td>
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
    </article>
  );
};

export default ManageServiceCompanyDescription;
