import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import Select from "react-select";

import { addCity } from "./citySlice";
import { countryList } from "../ManageCountry/countrySlice";

const AddCity = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  const countries = useSelector((state) => state.country.countryList);

  useEffect(() => {
    dispatch(countryList({ page: 1, limit: 1000, search: "" }));
  }, [dispatch]);

  const validationSchema = Yup.object().shape({
    countryId: Yup.string().required("*Country is required"),
  });

  const formik = useFormik({
    initialValues: {
      countryId: "",
      isTopCity: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!file) {
        toast.error("Please upload a CSV or Excel file.");
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("countryId", values.countryId);
      formData.append("isTopCity", values.isTopCity);
      formData.append("status", true);
      formData.append("city", file); // 👈 send file as 'city'

      try {
        const response = await dispatch(addCity(formData));
        const { payload } = response || {};

        if (payload?.code === 1) {
          toast.success("Cities imported successfully");
          navigate("/admin/manage-cities");
        } else {
          toast.error(payload?.message || "Something went wrong");
        }
      } catch (err) {
        toast.error("Failed to import cities.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const { values, handleSubmit, touched, errors, handleBlur, setFieldValue } =
    formik;

  const countryOptions = countries.map((country) => ({
    value: country._id,
    label: country.pageName,
  }));

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center col-rever">
          <div className="col-12">
            <h2 className="head-title">Import Cities via Excel/CSV</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <form
              onSubmit={handleSubmit}
              className="form-style"
              encType="multipart/form-data"
            >
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Upload File (.csv, .xlsx)</label>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="form-control"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <span className="errorMessage">
                      {!file && isSubmitting && "Please upload a file."}
                    </span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Select Country</label>
                    <Select
                      name="countryId"
                      options={countryOptions}
                      placeholder="Search and select country"
                      value={countryOptions.find(
                        (option) => option.value === values.countryId
                      )}
                      onChange={(selected) =>
                        setFieldValue("countryId", selected?.value)
                      }
                      onBlur={handleBlur}
                      isSearchable={true}
                    />
                    <span className="errorMessage">
                      {touched.countryId && errors.countryId}
                    </span>
                  </div>
                </div>

                <div className="col-md-6 d-flex align-items-center">
                  <label className="d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      name="isTopCity"
                      checked={values.isTopCity}
                      onChange={(e) =>
                        setFieldValue("isTopCity", e.target.checked)
                      }
                      className="toggle"
                    />
                    <span>Is Top City</span>
                  </label>
                </div>

                <div className="col-12 mt-5 text-center">
                  <button
                    type="submit"
                    className="btn btn-save"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Uploading..." : "Import Cities"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
};

export default AddCity;
