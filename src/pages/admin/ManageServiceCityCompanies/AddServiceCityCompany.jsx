import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { addServiceCityCompany } from "./serviceCityCompaniesSlice";
import { serviceCompanyList } from "../ManageServiceCompanies/serviceCompanySlice";
import { cityList } from "../ManageCity/citySlice";

const AddServiceCityCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fileMode, setFileMode] = useState(false);
  const [file, setFile] = useState(null);

  const serviceCompanies = useSelector(
    (state) => state.serviceCompany.serviceCompanyList
  );

  useEffect(() => {
    dispatch(serviceCompanyList({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const validationSchema = Yup.object().shape({
    serviceCompanyId: Yup.string().required("*Service Company is required"),
  });

  const formik = useFormik({
    initialValues: {
      serviceCompanyId: "",
      cityIds: [],
      forAll: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const selectedService =
          serviceCompanies.find((sc) => sc._id === values.serviceCompanyId)
            ?.query || "";

        if (fileMode) {
          // ✅ FILE UPLOAD MODE
          if (!file) {
            toast.error("Please upload a CSV / XLSX file");
            setIsSubmitting(false);
            return;
          }

          const formData = new FormData();
          formData.append("serviceCompanyId", values.serviceCompanyId);
          formData.append("service", selectedService); // ✅ REQUIRED
          formData.append("citiesFile", file); // ✅ MATCHES BACKEND EXPECTATION
          formData.append("status", true);

          const response = await dispatch(addServiceCityCompany(formData));
          const { payload } = response;

          if (payload?.code === 1) {
            toast.success("Cities mapped successfully!");
            navigate("/admin/manage-service-city-companies");
          } else {
            toast.error(payload?.message || "Something went wrong");
          }
        } else {
          // ✅ MANUAL SELECTION MODE
          const selectedCityNames = values.forAll
            ? []
            : (values.cityIds || []).map((c) => c.label);

          const payload = {
            service: selectedService,
            cities: selectedCityNames,
            forAll: values.forAll,
            serviceCompanyId: values.serviceCompanyId,
          };

          const response = await dispatch(addServiceCityCompany(payload));
          const { payload: result } = response || {};

          if (result?.code === 1) {
            toast.success("Service-City-Company mappings created successfully");
            navigate("/admin/manage-service-city-companies");
          } else {
            toast.error(result?.message || "Something went wrong");
          }
        }
      } catch {
        toast.error("Failed to save data.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const { values, touched, errors, handleSubmit, setFieldValue, handleBlur } =
    formik;

  const serviceCompanyOptions =
    serviceCompanies?.map((sc) => ({
      value: sc._id,
      label: sc.query,
    })) || [];

  const loadCityOptions = async (inputValue, callback) => {
    const res = await dispatch(
      cityList({
        search: inputValue,
        page: 1,
        limit: 20,
      })
    );

    const options = (res?.payload?.countries || []).map((city) => ({
      label: city.pageName,
      value: city._id,
    }));
    callback(options);
  };

  return (
    <article className="col-lg-9 position-relative">
      <div className="article-body store-bd-gy">
        <h2 className="head-title text-center text-danger">
          Map Service Company to Cities
        </h2>

        <form onSubmit={handleSubmit} className="form-style">
          <div className="row justify-content-center">
            <div className="col-md-8 mb-3">
              <label>Service Company</label>
              <Select
                name="serviceCompanyId"
                options={serviceCompanyOptions}
                placeholder="Select service company"
                value={serviceCompanyOptions.find(
                  (opt) => opt.value === values.serviceCompanyId
                )}
                onChange={(opt) =>
                  setFieldValue("serviceCompanyId", opt?.value)
                }
                onBlur={handleBlur}
              />
              <span className="errorMessage">
                {touched.serviceCompanyId && errors.serviceCompanyId}
              </span>
            </div>

            {/* MODE SWITCH */}
            <div className="col-md-8 text-center mb-3">
              <button
                type="button"
                className={`btn ${
                  fileMode ? "btn-danger" : "btn-outline-danger"
                } me-2`}
                onClick={() => setFileMode(true)}
              >
                Upload File
              </button>
              <button
                type="button"
                className={`btn ${
                  !fileMode ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => setFileMode(false)}
              >
                Manual Selection
              </button>
            </div>

            {/* FILE UPLOAD MODE */}
            {fileMode && (
              <div className="col-md-8 mb-3">
                <label>Upload Cities File (.csv, .xlsx, .xls)</label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            )}

            {/* MANUAL MODE */}
            {!fileMode && (
              <div className="col-md-8 mb-3">
                <label className="form-label fw-bold">
                  City Selection Mode
                </label>
                <div className="d-flex gap-3 mb-3">
                  <button
                    type="button"
                    className={`btn ${
                      values.forAll ? "btn-danger" : "btn-outline-secondary"
                    }`}
                    onClick={() => setFieldValue("forAll", true)}
                  >
                    All Cities
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      !values.forAll ? "btn-danger" : "btn-outline-secondary"
                    }`}
                    onClick={() => setFieldValue("forAll", false)}
                  >
                    Selected Cities
                  </button>
                </div>

                {!values.forAll && (
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    loadOptions={loadCityOptions}
                    value={values.cityIds}
                    onChange={(selected) => setFieldValue("cityIds", selected)}
                    onBlur={handleBlur}
                    placeholder="Search cities by name"
                  />
                )}
              </div>
            )}

            <div className="col-12 text-center mt-4">
              <button
                type="submit"
                className="btn btn-danger px-5 py-2 rounded-pill fs-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </article>
  );
};

export default AddServiceCityCompany;
