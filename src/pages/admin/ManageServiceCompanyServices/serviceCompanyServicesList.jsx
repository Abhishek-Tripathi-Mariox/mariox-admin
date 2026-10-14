import { useEffect, useState, useCallback } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../../../components/deleteModal";
import {
  serviceCompanyServicesList,
  deleteServiceCompanyServices,
  toggleServiceCompanyServices,
  storeCompanyServicesFilters,
} from "./serviceCompanyServicesSlice";

const ManageServiceCompanyServices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    serviceCompanyServicesList: data,
    total,
    filters,
  } = useSelector((state) => state.serviceCompanyServices);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const toggle = () => setModal(!modal);

  const fetchList = useCallback(() => {
    dispatch(serviceCompanyServicesList(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handlePageChange = (page) => {
    const updated = { ...filters, page };
    dispatch(storeCompanyServicesFilters(updated));
  };

  const handleSearch = debounce((e) => {
    const updated = { ...filters, search: e.target.value, page: 1 };
    dispatch(storeCompanyServicesFilters(updated));
  }, 400);

  const deleteHandler = () => {
    dispatch(deleteServiceCompanyServices({ id: deleteId, filters })).then(
      (res) => {
        if (res?.payload?.code === 1) {
          toast.success("Deleted successfully");
          toggle();
        } else {
          toast.error(res?.payload?.message || "Failed to delete");
        }
      }
    );
  };

  const toggleHandler = (id) => {
    dispatch(toggleServiceCompanyServices({ id, filters }));
  };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="head-title">Global Services</h2>
          <Link to="/admin/manage-global-services/add" className="add-new">
            + Add New
          </Link>
        </div>

        <div className="mb-3">
          <input
            type="search"
            className="form-control"
            placeholder="Search service"
            defaultValue={filters.search}
            onChange={handleSearch}
          />
        </div>

        <div className="table-responsive">
          <table className="table text-center">
            <thead>
              <tr>
                <th>Service</th>
                <th>Link</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.service}</td>
                    <td>{item.link}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.status}
                        onChange={() => toggleHandler(item._id)}
                        className="toggle"
                      />
                    </td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>

                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn"
                          onClick={() =>
                            navigate(
                              `/admin/manage-global-services/details/${item._id}`
                            )
                          }
                        >
                          <img src="/assets/images/view.png" alt="View" />
                        </button>

                        <button
                          className="btn"
                          onClick={() =>
                            navigate(
                              `/admin/manage-global-services/edit/${item._id}`
                            )
                          }
                        >
                          <img src="/assets/images/edit.png" alt="Edit" />
                        </button>

                        <button
                          className="btn"
                          onClick={() => {
                            setDeleteId(item._id);
                            toggle();
                          }}
                        >
                          <img src="/assets/images/delete.png" alt="Delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No data found</td>
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

export default ManageServiceCompanyServices;
