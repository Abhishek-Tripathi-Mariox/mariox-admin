import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  addServiceCompanyServices,
  serviceCompanyServicesDetails,
} from "./serviceCompanyServicesSlice";

const EditServiceCompanyServices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, serviceCompanyId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    service: Yup.string().required("*Service name is required"),
  });

  const formik = useFormik({
    initialValues: { service: "", status: true, id, serviceCompanyId },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const response = await dispatch(addServiceCompanyServices(values));
      if (response?.payload?.code === 1) {
        toast.success("Service updated successfully");
        navigate(`/admin/manage-global-services`);
      } else {
        toast.error(response?.payload?.message || "Something went wrong");
      }
      setIsSubmitting(false);
    },
  });

  const { values, handleChange, handleSubmit, setFieldValue, touched, errors } =
    formik;

  useEffect(() => {
    dispatch(serviceCompanyServicesDetails({ id })).then((res) => {
      const data = res?.payload;
      if (data) {
        setFieldValue("service", data.service || "");
        setFieldValue("status", data.status ?? true);
      }
    });
  }, [dispatch, id]);

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <h2 className="head-title">Edit Service</h2>
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

export default EditServiceCompanyServices;
