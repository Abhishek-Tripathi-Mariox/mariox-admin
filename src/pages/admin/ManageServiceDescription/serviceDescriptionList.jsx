import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import DeleteModal from "../../../components/deleteModal";
import {
  serviceDescriptionList,
  deleteServiceDescription,
  toggleServiceDescription,
} from "./serviceDescriptionSlice";

const ServiceDescriptionList = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [id, setDeleteId] = useState("");
  const data =
    useSelector((state) => state.serviceDescription?.serviceDescriptionList) ||
    [];
  const total = useSelector((state) => state.serviceDescription?.total) || 0;
  const loading = useSelector((state) => state.serviceDescription?.isLoading);

  // Pagination state (uses backend pagination if needed)
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(serviceDescriptionList({ serviceId, page, limit }));
  }, [dispatch, serviceId, page]);

  const toggle = () => setModal(!modal);

  const deleteHandler = () => {
    dispatch(deleteServiceDescription({ id, serviceId })).then((res) => {
      if (res?.payload?.code === 1) {
        toggle();
        toast.success("Deleted successfully");
        dispatch(serviceDescriptionList({ serviceId, page }));
      } else {
        toast.error(res?.payload?.message || "Failed to delete");
      }
    });
  };

  const handleToggle = (id) => {
    dispatch(toggleServiceDescription({ id, serviceId })).then((res) => {
      const { code, message } = res.payload || {};
      toast[code === 1 ? "success" : "error"](message || "Action failed");
      dispatch(serviceDescriptionList({ serviceId, page }));
    });
  };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center">
          <div className="col-md-8 mb-3">
            <h2 className="head-title">Service Description</h2>
          </div>
          <div className="col-md-4 mb-3 d-flex justify-content-end">
            <button
              onClick={() =>
                navigate(`/admin/manage-service-description/add/${serviceId}`)
              }
              className="btn btn-primary"
            >
              + Add Description
            </button>
          </div>
        </div>

        <div className="table-responsive">
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
                          __html: desc.description?.substring(0, 100) + "...",
                        }}
                      />
                    </td>
                    <td>
                      <button className="btn">
                        <input
                          checked={desc.status}
                          onChange={() => handleToggle(desc._id)}
                          type="checkbox"
                          className="toggle"
                        />
                      </button>
                    </td>
                    <td>{new Date(desc.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/manage-service-description/edit/${desc._id}?serviceId=${serviceId}`
                            )
                          }
                          className="btn"
                          title="Edit"
                        >
                          <img src="/assets/images/edit.png" alt="Edit" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(desc._id);
                            toggle();
                          }}
                          className="btn"
                          title="Delete"
                        >
                          <img src="/assets/images/delete.png" alt="Delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No description found for this service.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {total > limit && (
          <Pagination
            activePage={page}
            itemsCountPerPage={limit}
            totalItemsCount={total}
            pageRangeDisplayed={5}
            onChange={(p) => setPage(p)}
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
export default ServiceDescriptionList;
