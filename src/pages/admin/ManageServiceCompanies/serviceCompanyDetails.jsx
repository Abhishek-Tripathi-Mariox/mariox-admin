import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { serviceCompanyDetails } from "./serviceCompanySlice";

const ServiceCompanyDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [params, setParams] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(serviceCompanyDetails({ id })).then((res) => {
        const data = res?.payload;
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

  const renderTextArea = (label, value) => (
    <div className="col-md-12 mb-3">
      <label className="form-label fw-bold">{label}</label>
      <textarea
        className="form-control"
        rows="2"
        readOnly
        value={value || "-"}
      />
    </div>
  );

  if (!params) return null;

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row">
          <div className="col-sm-12">
            <h2 className="head-title">Service Company Type Details</h2>

            <form className="form-style row">
              {renderBox("Query", params.query)}
              {renderBox("Slug", params.slug)}

              {/* SEO Section */}
              <div className="col-12 mt-4">
                <h5 className="text-primary fw-bold">SEO Details</h5>
                <hr />
              </div>

              {renderBox("SEO Title", params.seoMeta?.title)}
              {renderTextArea("SEO Description", params.seoMeta?.description)}
              {renderBox("SEO Keywords", params.seoMeta?.keywords?.join(", "))}
              {renderBox("SEO Robots", params.seoMeta?.robots?.join(", "))}

              {/* H1 Section */}
              <div className="col-12 mt-4">
                <h5 className="text-primary fw-bold">H1 Section</h5>
                <hr />
              </div>

              {renderBox("H1 Text", params.h1Text)}
              {renderTextArea("H1 Description", params.h1Desc)}

              {/* H2 Section */}
              <div className="col-12 mt-4">
                <h5 className="text-primary fw-bold">H2 Section</h5>
                <hr />
              </div>

              {renderBox("H2 Text", params.h2Text)}
              {renderTextArea("H2 Description", params.h2Desc)}

              {/* Timestamps */}
              <div className="col-12 mt-4">
                <h5 className="text-primary fw-bold">Timestamps</h5>
                <hr />
              </div>

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

export default ServiceCompanyDetails;
