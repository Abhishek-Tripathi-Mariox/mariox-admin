import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { serviceCompanyDescriptionDetails } from "./serviceCompanyDescriptionSlice";

const ServiceCompanyDescriptionDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [params, setParams] = useState({
    description: "",
    status: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(serviceCompanyDescriptionDetails({ id })).then((res) => {
        const data = res?.payload;
        if (data) {
          setParams({
            description: data.description || "",
            status: data.status ? "Active" : "Inactive",
            createdAt: new Date(data.createdAt).toLocaleString(),
            updatedAt: new Date(data.updatedAt).toLocaleString(),
          });
        }
      });
    }
  }, [dispatch, id]);

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row">
          <div className="col-sm-12">
            <h2 className="head-title">Service Company Description Details</h2>
            <form className="form-style row">
              <div className="col-12 mb-3">
                <label className="form-label fw-bold">Description</label>
                <div
                  className="border p-3 rounded bg-light"
                  style={{ minHeight: "200px" }}
                  dangerouslySetInnerHTML={{
                    __html: params.description || "-",
                  }}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Status</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={params.status}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Created At</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={params.createdAt}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Updated At</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={params.updatedAt}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceCompanyDescriptionDetails;
