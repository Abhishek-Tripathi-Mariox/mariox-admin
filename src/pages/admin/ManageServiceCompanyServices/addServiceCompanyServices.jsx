import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { addServiceCompanyServices } from "./serviceCompanyServicesSlice";
import { useState } from "react";

const AddServiceCompanyServices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    service: Yup.string().required("*Service name is required"),
    link: Yup.string().url("Enter a valid URL").required("*Link is required"),
  });

  const formik = useFormik({
    initialValues: {
      service: "",
      link: "",
      status: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const response = await dispatch(addServiceCompanyServices(values));
      if (response?.payload?.code === 1) {
        toast.success("Service added successfully");
        navigate(`/admin/manage-global-services`);
      } else {
        toast.error(response?.payload?.message || "Something went wrong");
      }
      setIsSubmitting(false);
    },
  });

  const { values, handleChange, handleSubmit, touched, errors } = formik;

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <h2 className="head-title">Add New Service</h2>
        <form onSubmit={handleSubmit} className="form-style">
          <label className="fw-bold">Service Name</label>
          <input
            type="text"
            name="service"
            className="form-control"
            value={values.service}
            onChange={handleChange}
          />
          {touched.service && errors.service && (
            <span className="errorMessage">{errors.service}</span>
          )}

          <label className="d-flex align-items-center gap-2 mt-3">
            <input
              type="checkbox"
              name="status"
              checked={values.status}
              onChange={handleChange}
              className="toggle"
            />
            <span>Status</span>
          </label>
          <label className="fw-bold mt-3">Link</label>
          <input
            type="text"
            name="link"
            className="form-control"
            value={values.link}
            onChange={handleChange}
          />
          {touched.link && errors.link && (
            <span className="errorMessage">{errors.link}</span>
          )}

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

export default AddServiceCompanyServices;
