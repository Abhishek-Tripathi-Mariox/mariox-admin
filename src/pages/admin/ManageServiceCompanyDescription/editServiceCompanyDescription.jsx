import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  addServiceCompanyDescription,
  serviceCompanyDescriptionDetails,
} from "./serviceCompanyDescriptionSlice";

const stripHtml = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

const EditServiceCompanyDescription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, serviceCompanyId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    description: Yup.string().required("*Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      description: "",
      status: true,
      id,
      serviceCompanyId,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      const payload = {
        ...values,
        description: stripHtml(values.description), // ✅ store plain text only
      };

      const response = await dispatch(addServiceCompanyDescription(payload));
      if (response?.payload?.code === 1) {
        toast.success("Service Company Description updated successfully");
        navigate(
          `/admin/manage-service-company-description/${serviceCompanyId}`
        );
      } else {
        toast.error(response?.payload?.message || "Something went wrong");
      }
      setIsSubmitting(false);
    },
  });

  const { values, handleSubmit, touched, errors, setFieldValue } = formik;

  useEffect(() => {
    dispatch(serviceCompanyDescriptionDetails({ id })).then((res) => {
      const data = res?.payload;
      if (data) {
        setFieldValue("description", data.description || "");
        setFieldValue("status", data.status ?? true);
      }
    });
  }, [dispatch, id]);

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <h2 className="head-title">Edit Service Company Description</h2>
        <form onSubmit={handleSubmit} className="form-style">
          <label className="fw-bold">Description</label>
          <ReactQuill
            value={values.description}
            onChange={(content) => setFieldValue("description", content)}
            onBlur={() => formik.setFieldTouched("description", true)}
          />
          {touched.description && errors.description && (
            <span className="errorMessage">{errors.description}</span>
          )}

          <label className="d-flex align-items-center gap-2 mt-3">
            <input
              type="checkbox"
              checked={values.status}
              onChange={(e) => setFieldValue("status", e.target.checked)}
              className="toggle"
            />
            <span>Status</span>
          </label>

          <button
            type="submit"
            className="btn btn-save mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </article>
  );
};

export default EditServiceCompanyDescription;
