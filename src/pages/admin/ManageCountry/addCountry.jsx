import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { addCountry } from "./countrySlice";

const AddCountry = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  const validationSchema = Yup.object().shape({
    file: Yup.mixed().required("*Please upload an Excel/CSV file"),
  });

  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema,
    onSubmit: async () => {
      if (!file) {
        toast.error("Please upload a file.");
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("country", file); // 👈 key should match backend

      try {
        const response = await dispatch(addCountry(formData));
        const { payload } = response || {};

        if (payload?.code === 1) {
          toast.success("Countries imported successfully");
          navigate("/admin/manage-countries");
        } else {
          toast.error(payload?.message || "Something went wrong");
        }
      } catch (err) {
        toast.error("Failed to import countries.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const { handleSubmit, touched, errors, setFieldValue } = formik;

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center col-rever">
          <div className="col-12">
            <h2 className="head-title">Import Countries via Excel/CSV</h2>
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
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        setFile(selectedFile);
                        setFieldValue("file", selectedFile); // ✅ Formik sync
                      }}
                    />
                    {touched.file && errors.file && (
                      <span className="errorMessage">{errors.file}</span>
                    )}
                  </div>
                </div>

                <div className="col-12 mt-5 text-center">
                  <button
                    type="submit"
                    className="btn btn-save"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Uploading..." : "Import Countries"}
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

export default AddCountry;
