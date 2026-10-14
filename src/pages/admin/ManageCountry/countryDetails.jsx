import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormInputText from "../../../components/FormInputText";
import { countryDetails } from "./countrySlice";

const CountryDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [params, setParams] = useState({
    slug: "",
    pageName: "",
    status: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(countryDetails({ id })).then((res) => {
        const data = res?.payload;
        if (data) {
          setParams({
            slug: data.slug || "",
            pageName: data.pageName || "",
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
            <h2 className="head-title">Country Details</h2>
            <form className="form-style row">
              <div className="col-md-6 mb-3">
                <FormInputText
                  readOnly
                  title="Country Name"
                  name="pageName"
                  value={params.pageName}
                />
              </div>
              <div className="col-md-6 mb-3">
                <FormInputText
                  readOnly
                  title="Slug"
                  name="slug"
                  value={params.slug}
                />
              </div>
              <div className="col-md-6 mb-3">
                <FormInputText
                  readOnly
                  title="Status"
                  name="status"
                  value={params.status}
                />
              </div>
              <div className="col-md-6 mb-3">
                <FormInputText
                  readOnly
                  title="Created At"
                  name="createdAt"
                  value={params.createdAt}
                />
              </div>
              <div className="col-md-6 mb-3">
                <FormInputText
                  readOnly
                  title="Updated At"
                  name="updatedAt"
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

export default CountryDetails;
