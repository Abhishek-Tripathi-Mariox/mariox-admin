import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  specializationCityDetails,
  updateSpecializationCity,
} from "./serviceCitiesSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditServiceCity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    dispatch(specializationCityDetails({ id })).then((res) => {
      const data = res?.payload;
      if (data) {
        setInitialValues({
          pageName: data.pageName || "",
          slug: data.slug || "",
          serviceName: data.serviceName || "",
          cityName: data.cityName || "",
          h1Text: data.h1Text || "",
          h1Desc: data.h1Desc || "",
          h2Text: data.h2Text || "",
          aboutService: data.aboutService || "",
          aboutPage: data.aboutPage || "",
          aboutName: data.aboutName || "",
          seoMeta: {
            title: data?.seoMeta?.title || "",
            description: data?.seoMeta?.description || "",
            keywords: (data?.seoMeta?.keywords || []).join(", "),
            robots: (data?.seoMeta?.robots || []).join(", "),
          },
        });
      }
    });
  }, [dispatch, id]);

  const validationSchema = Yup.object().shape({
    pageName: Yup.string().required("*Page name is required"),
    slug: Yup.string().required("*Slug is required"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const response = await dispatch(
        updateSpecializationCity({ id, data: values })
      );
      const { payload } = response || {};
      if (payload?.code === 1) {
        toast.success("Service city updated successfully");
        navigate("/admin/manage-serviceCities");
      } else {
        toast.error(payload?.message || "Something went wrong");
        setIsSubmitting(false);
      }
    },
  });

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    touched,
    errors,
  } = formik;

  const renderInput = (name, label) => (
    <div className="col-12 mb-3">
      <label className="form-label fw-bold">{label}</label>
      <input
        type="text"
        className="form-control"
        name={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={label}
      />
      {touched[name] && errors[name] && (
        <div className="errorMessage">{errors[name]}</div>
      )}
    </div>
  );

  const renderRichTextEditor = (name, label) => (
    <div className="col-12 mb-3">
      <label className="form-label fw-bold">{label}</label>
      <ReactQuill
        theme="snow"
        value={values[name] || ""}
        onChange={(content) => setFieldValue(name, content)}
        onBlur={() => formik.setFieldTouched(name, true)}
        className="bg-white"
      />
    </div>
  );

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center col-rever">
          <div className="col-12">
            <h2 className="head-title text-center text-danger">
              Edit Service City
            </h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12">
            <form onSubmit={handleSubmit} className="form-style">
              <div className="row justify-content-center">
                {renderInput("pageName", "Page Name")}
                {renderInput("slug", "Slug")}
                {renderInput("serviceName", "Service Name")}
                {renderInput("cityName", "City Name")}
                {renderInput("h1Text", "H1 Text")}
                {renderInput("h1Desc", "H1 Description")}
                {renderInput("h2Text", "H2 Text")}
                {renderInput("aboutName", "About Type")}
                {renderInput("seoMeta.title", "SEO Title")}
                {renderInput("seoMeta.description", "SEO Description")}
                {renderInput(
                  "seoMeta.keywords",
                  "SEO Keywords (comma separated)"
                )}
                {renderInput("seoMeta.robots", "SEO Robots (comma separated)")}

                {/* {renderRichTextEditor("aboutService", "About Service")} */}
                {renderRichTextEditor("aboutPage", "About Page")}

                <div className="col-12 text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-danger px-5 py-2 rounded-pill fs-5"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
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

export default EditServiceCity;
