import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serviceCompanyServicesDetails } from "./serviceCompanyServicesSlice";

const ServiceCompanyServicesDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [details, setDetails] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(serviceCompanyServicesDetails({ id })).then((res) => {
        setDetails(res?.payload || {});
      });
    }
  }, [dispatch, id]);

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        {/* ==== TOP BAR WITH BACK BUTTON ==== */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="head-title">Service Details</h2>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin/manage-global-services")}
          >
            ⬅ Back
          </button>
        </div>

        <form className="form-style">
          <label className="fw-bold">Service Name</label>
          <input
            className="form-control"
            value={details.service || ""}
            readOnly
          />

          <label className="fw-bold mt-3">Status</label>
          <input
            className="form-control"
            value={details.status ? "Active" : "Inactive"}
            readOnly
          />

          <label className="fw-bold mt-3">Created At</label>
          <input
            className="form-control"
            value={
              details.createdAt
                ? new Date(details.createdAt).toLocaleString()
                : ""
            }
            readOnly
          />

          <label className="fw-bold mt-3">Updated At</label>
          <input
            className="form-control"
            value={
              details.updatedAt
                ? new Date(details.updatedAt).toLocaleString()
                : ""
            }
            readOnly
          />
        </form>
      </div>
    </article>
  );
};

export default ServiceCompanyServicesDetails;
