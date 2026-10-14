import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { addSpecializationCityBulk } from "./serviceCitiesSlice";
import { specializationList } from "../ManageServices/serviceSlice";
import { cityList, fetchCitiesFromExcelFile } from "../ManageCity/citySlice";

const AddServiceCity = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceList = useSelector((state) => state.service.specializationList);
  const loading = useSelector(
    (state) => state.city.isLoading || state.service.isLoading
  );

  useEffect(() => {
    dispatch(specializationList({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const validationSchema = Yup.object().shape({
    serviceId: Yup.string().required("*Service is required"),
    cityIds: Yup.array(), // optional
    forAll: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      serviceId: "",
      cityIds: [],
      forAll: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      const payload = {
        serviceId: values.serviceId,
        forAll: values.forAll,
      };

      if (!values.forAll) {
        payload.cityIds = values.cityIds.map((c) => c.value);
      }

      const response = await dispatch(addSpecializationCityBulk(payload));
      const { payload: result } = response || {};

      if (result?.code === 1) {
        toast.success("Service-City mappings created successfully");
        navigate("/admin/manage-serviceCities");
      } else {
        toast.error(result?.message || "Something went wrong");
        setIsSubmitting(false);
      }
    },
  });

  const { values, handleSubmit, touched, errors, setFieldValue, handleBlur } =
    formik;

  const serviceOptions = serviceList.map((s) => ({
    value: s._id,
    label: s.pageName,
  }));

  // 🔍 Dynamic city search by name using API
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("city", file);

    try {
      const res = await dispatch(fetchCitiesFromExcelFile(formData));
      const citiesFromFile = res?.payload || [];

      const selectedCities = citiesFromFile.map((c) => ({
        value: c._id,
        label: c.pageName,
      }));

      const mergedCities = [...values.cityIds, ...selectedCities].filter(
        (v, i, self) => i === self.findIndex((t) => t.value === v.value)
      );

      setFieldValue("cityIds", mergedCities);
      toast.success("Cities loaded from file");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cities from file");
    }
  };

  return (
    <article className="col-lg-9 position-relative">
      {isSubmitting && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(255,255,255,0.6)", zIndex: 9999 }}
        >
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="article-body store-bd-gy">
        <div className="row align-items-center col-rever">
          <div className="col-12">
            <h2 className="head-title text-center text-danger">
              Map Service to Cities
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <strong>Loading options...</strong>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-style">
            <div className="row justify-content-center">
              <div className="col-md-8 mb-3">
                <label>Service</label>
                <Select
                  name="serviceId"
                  options={serviceOptions}
                  placeholder="Select service"
                  value={serviceOptions.find(
                    (opt) => opt.value === values.serviceId
                  )}
                  onChange={(opt) => setFieldValue("serviceId", opt?.value)}
                  onBlur={handleBlur}
                />
                <span className="errorMessage">
                  {touched.serviceId && errors.serviceId}
                </span>
              </div>

              <div className="col-md-8 mb-4">
                <label className="form-label fw-bold">
                  City Selection Mode
                </label>
                <div className="d-flex gap-3">
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
              </div>

              {/* {!values.forAll && (
                <div className="col-md-8 mb-4">
                  <label className="form-label fw-bold">Select Cities</label>
                  <AsyncSelect
                    isMulti
                    name="cityIds"
                    cacheOptions
                    defaultOptions
                    placeholder="Search cities by name"
                    loadOptions={loadCityOptions}
                    value={values.cityIds}
                    onChange={(selected) => setFieldValue("cityIds", selected)}
                    onBlur={handleBlur}
                  />
                  <span className="errorMessage">
                    {touched.cityIds && errors.cityIds}
                  </span>
                </div>
              )} */}

              {!values.forAll && (
                <>
                  <div className="col-md-8 mb-3">
                    <label className="form-label fw-bold">
                      Upload City Excel File
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".xls,.xlsx"
                      onChange={handleFileUpload}
                    />
                    <small className="text-muted">
                      Upload an Excel file with city names. Existing cities will
                      be selected.
                    </small>
                  </div>

                  <div className="col-md-8 mb-4">
                    <label className="form-label fw-bold">Select Cities</label>
                    <AsyncSelect
                      isMulti
                      name="cityIds"
                      cacheOptions
                      defaultOptions
                      placeholder="Search cities by name"
                      loadOptions={loadCityOptions}
                      value={values.cityIds}
                      onChange={(selected) =>
                        setFieldValue("cityIds", selected)
                      }
                      onBlur={handleBlur}
                    />
                    <span className="errorMessage">
                      {touched.cityIds && errors.cityIds}
                    </span>
                  </div>
                </>
              )}

              <div className="col-12 text-center mt-4">
                <button
                  type="submit"
                  className="btn btn-danger px-5 py-2 rounded-pill fs-5"
                  disabled={isSubmitting}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </article>
  );
};

export default AddServiceCity;
