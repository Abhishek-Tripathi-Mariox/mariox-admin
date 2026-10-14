import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { serviceCityImageDetail } from "./serviceCityContentSlice";

const ServiceDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [params, setParams] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(serviceCityImageDetail({ id })).then((res) => {
        const data = res?.payload?.data;
        if (data) setParams(data);
      });
    }
  }, [dispatch, id]);

  const renderBox = (label, value) => (
    <div className="col-md-6 mb-3">
      <label className="form-label fw-bold">{label}</label>
      <input
        type="text"
        className="form-control"
        readOnly
        value={value || "-"}
      />
    </div>
  );

  const renderHTML = (label, html) => (
    <div className="col-12 mb-3">
      <label className="fw-bold d-block mb-1">{label}</label>
      <div
        className="border p-3 rounded bg-light"
        dangerouslySetInnerHTML={{ __html: html || "-" }}
      />
    </div>
  );

  const renderImage = (label, src) => (
    <div className="col-12 mb-4">
      <label className="form-label fw-bold d-block mb-2">{label}</label>
      {src ? (
        <img
          src={src}
          alt="service"
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      ) : (
        <p className="text-muted">No image available</p>
      )}
    </div>
  );

  if (!params) return null;

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row">
          <div className="col-sm-12">
            <h2 className="head-title">Service Image Details</h2>
            <form className="form-style row">
              {renderBox("Service Name", params.serviceName)}
              {renderBox("Title", params.title)}

              {renderImage("Service Image", params.image)}
              {renderHTML("Content", params.content)}

              {renderBox(
                "Created At",
                new Date(params.createdAt).toLocaleString()
              )}
              {renderBox(
                "Updated At",
                new Date(params.updatedAt).toLocaleString()
              )}
            </form>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceDetails;
