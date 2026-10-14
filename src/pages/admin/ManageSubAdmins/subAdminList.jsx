import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../../../components/deleteModal";
import { deleteSubAdmin, subAdminList, toggleSubAdmin } from "./subAdminsSlice";

const SubAdminList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [id, setDeleteId] = useState("");

  const filter = useSelector((state) => state.subAdmin.filters);
  const data = useSelector((state) => state.subAdmin?.subAdminList);
  const total = useSelector((state) => state.subAdmin?.total);

  const [filters, setFilters] = useState(filter);

  useEffect(() => {
    if (filter) setFilters(filter);
  }, [filter]);

  const getSubAdminListing = useCallback(() => {
    dispatch(subAdminList(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    getSubAdminListing();
  }, [getSubAdminListing]);

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleSearch = debounce((e) => {
    setFilters({ ...filters, page: 1, search: e.target.value });
  }, 300);

  const toggle = () => setModal(!modal);

  const deleteHandler = () => {
    dispatch(deleteSubAdmin({ filters, id })).then((res) => {
      if (res?.payload?.code === 1) {
        toggle();
        toast.success("Deleted successfully");
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const toggleTab = (isActive) => {
    setFilters({ ...filters, isActive, page: 1 });
  };

  const handleToggle = (id) => {
    dispatch(toggleSubAdmin({ filters, id })).then((res) => {
      const { code, message } = res.payload;
      toast[code === 1 ? "success" : "error"](message);
    });
  };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3">
            <div className="link-active">
              <img src="/assets/images/Users-selected.png" alt="users" />
              <span>
                <p>{total || 0}</p>
                <p>Total SubAdmins</p>
              </span>
            </div>
          </div>
          <div className="col-md-6 mb-3 d-flex justify-content-end">
            <form className="has-search mr-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search SubAdmin by Name"
                onChange={handleSearch}
              />
            </form>
            <Link to="/admin/manage-subAdmins/add" className="add-new">
              + Add New
            </Link>
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

            <div className="table-responsive mt-4">
              <table className="table text-center">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Permissions</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.length > 0 ? (
                    data.map((admin) => (
                      <tr key={admin._id}>
                        <td>{admin.name || "-"}</td>
                        <td>{admin.email}</td>
                        <td>{admin.role}</td>
                        <td>
                          {admin.permissions
                            ? Object.entries(admin.permissions)
                                .filter(([_, val]) => val)
                                .map(([key]) => key)
                                .join(", ")
                            : "-"}
                        </td>
                        <td>
                          <button className="btn">
                            <input
                              type="checkbox"
                              className="toggle"
                              checked={admin.status}
                              onChange={() => handleToggle(admin._id)}
                            />
                          </button>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/manage-subAdmins/details/${admin._id}`
                                )
                              }
                              className="btn"
                              title="View"
                            >
                              <img src="/assets/images/view.png" alt="view" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/manage-subAdmins/edit/${admin._id}`
                                )
                              }
                              className="btn"
                              title="Edit"
                            >
                              <img src="/assets/images/edit.png" alt="edit" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(admin._id);
                                toggle();
                              }}
                              className="btn"
                              title="Delete"
                            >
                              <img
                                src="/assets/images/delete.png"
                                alt="delete"
                              />
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

export default SubAdminList;
