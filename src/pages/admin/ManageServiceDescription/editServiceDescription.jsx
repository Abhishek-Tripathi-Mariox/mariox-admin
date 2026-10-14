import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  addServiceDescription,
  serviceDescriptionDetails,
} from "./serviceDescriptionSlice";

const EditServiceDescription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("serviceId"); // preferred: pass as query param in routes!
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    description: Yup.string().required("*Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      description: "",
      status: true,
      faqId: id,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const response = await dispatch(
        addServiceDescription({ ...values, faqId: id, serviceId })
      );
      const { payload } = response || {};
      if (payload?.code === 1) {
        toast.success("Service Description updated successfully");
        navigate(`/admin/manage-service-description/${serviceId}`);
      } else {
        toast.error(payload?.message || "Something went wrong");
        setIsSubmitting(false);
      }
    },
  });

  const { values, handleSubmit, touched, errors, setFieldValue } = formik;

  useEffect(() => {
    if (id) {
      dispatch(serviceDescriptionDetails({ id })).then((res) => {
        const data = res?.payload;
        if (data) {
          setFieldValue("description", data.description || "");
          setFieldValue("status", data.status ?? true);
        }
      });
    }
  }, [dispatch, id, setFieldValue]);

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center col-rever">
          <div className="col-12">
            <h2 className="head-title">Edit Service Description</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <form onSubmit={handleSubmit} className="form-style">
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-bold">Description</label>
                  <ReactQuill
                    theme="snow"
                    value={values.description}
                    onChange={(content) =>
                      setFieldValue("description", content)
                    }
                    onBlur={() => formik.setFieldTouched("description", true)}
                    className="bg-white"
                    placeholder="Enter service description..."
                  />
                  {touched.description && errors.description && (
                    <span className="errorMessage">{errors.description}</span>
                  )}
                </div>
                <div className="col-md-6 mt-3 d-flex align-items-center">
                  <label className="d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      name="status"
                      checked={values.status}
                      onChange={(e) =>
                        setFieldValue("status", e.target.checked)
                      }
                      className="toggle"
                    />
                    <span>Status (Active/Inactive)</span>
                  </label>
                </div>
                <div className="col-12 mt-5 text-center">
                  <button
                    type="submit"
                    className="btn btn-save"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
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

export default EditServiceDescription;
