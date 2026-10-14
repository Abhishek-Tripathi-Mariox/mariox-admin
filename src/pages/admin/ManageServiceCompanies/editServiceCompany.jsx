import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  addServiceCompany,
  serviceCompanyDetails,
} from "./serviceCompanySlice";

const generateSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const EditServiceCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    _id: id,
    query: "",
    slug: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    seoRobots: "",
    h1Text: "",
    h1Desc: "",
    h2Text: "",
    h2Desc: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(serviceCompanyDetails({ id })).then((res) => {
        const data = res?.payload;
        if (data) {
          setInitialValues({
            _id: data._id,
            query: data.query || "",
            slug: data.slug || generateSlug(data.query),
            seoTitle: data.seoMeta?.title || "",
            seoDescription: data.seoMeta?.description || "",
            seoKeywords: data.seoMeta?.keywords?.join(", ") || "",
            seoRobots: data.seoMeta?.robots?.join(", ") || "",
            h1Text: data.h1Text || "",
            h1Desc: data.h1Desc || "",
            h2Text: data.h2Text || "",
            h2Desc: data.h2Desc || "",
          });
        }
      });
    }
  }, [dispatch, id]);

  const validationSchema = Yup.object().shape({
    query: Yup.string().required("*Type Query is required"),
    slug: Yup.string().required("*Slug is required"),
    seoTitle: Yup.string().required("*SEO Title is required"),
    h1Text: Yup.string().required("*H1 Text is required"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      const payloadData = {
        _id: values._id,
        query: values.query,
        slug: values.slug,
        seoMeta: {
          title: values.seoTitle,
          description: values.seoDescription,
          keywords: values.seoKeywords
            ? values.seoKeywords.split(",").map((k) => k.trim())
            : [],
          robots: values.seoRobots
            ? values.seoRobots.split(",").map((r) => r.trim())
            : [],
        },
        h1Text: values.h1Text,
        h1Desc: values.h1Desc,
        h2Text: values.h2Text,
        h2Desc: values.h2Desc,
      };

      const response = await dispatch(addServiceCompany(payloadData));
      const { payload } = response || {};

      if (payload?.code === 1) {
        toast.success("Service company type updated successfully");
        navigate("/admin/manage-service-company");
      } else {
        toast.error(payload?.message || "Something went wrong");
        setIsSubmitting(false);
      }
    },
  });

  const {
    values,
    touched,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
  } = formik;

  useEffect(() => {
    if (values.query && !touched.slug) {
      setFieldValue("slug", generateSlug(values.query));
    }
  }, [values.query, touched.slug, setFieldValue]);

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <h2 className="head-title">Edit Service Company Type</h2>

        <form onSubmit={handleSubmit} className="form-style row">
          <div className="col-md-6 mb-3">
            <label>Type Query</label>
            <input
              type="text"
              name="query"
              className="form-control"
              value={values.query}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.query && errors.query && (
              <div className="errorMessage">{errors.query}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label>Slug</label>
            <input
              type="text"
              name="slug"
              className="form-control"
              value={values.slug}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.slug && errors.slug && (
              <div className="errorMessage">{errors.slug}</div>
            )}
          </div>

          <div className="col-12 mt-3">
            <h5 className="text-primary fw-bold">SEO Details</h5>
            <hr />
          </div>

          <div className="col-md-6 mb-3">
            <label>SEO Title</label>
            <input
              type="text"
              name="seoTitle"
              className="form-control"
              value={values.seoTitle}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.seoTitle && errors.seoTitle && (
              <div className="errorMessage">{errors.seoTitle}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label>SEO Description</label>
            <textarea
              name="seoDescription"
              className="form-control"
              rows="2"
              value={values.seoDescription}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>SEO Keywords (comma separated)</label>
            <input
              type="text"
              name="seoKeywords"
              className="form-control"
              value={values.seoKeywords}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>SEO Robots (comma separated)</label>
            <input
              type="text"
              name="seoRobots"
              className="form-control"
              value={values.seoRobots}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="col-12 mt-3">
            <h5 className="text-primary fw-bold">H1 Section</h5>
            <hr />
          </div>

          <div className="col-md-6 mb-3">
            <label>H1 Text</label>
            <input
              type="text"
              name="h1Text"
              className="form-control"
              value={values.h1Text}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.h1Text && errors.h1Text && (
              <div className="errorMessage">{errors.h1Text}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label>H1 Description</label>
            <textarea
              name="h1Desc"
              className="form-control"
              rows="2"
              value={values.h1Desc}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="col-12 mt-3">
            <h5 className="text-primary fw-bold">H2 Section</h5>
            <hr />
          </div>

          <div className="col-md-6 mb-3">
            <label>H2 Text</label>
            <input
              type="text"
              name="h2Text"
              className="form-control"
              value={values.h2Text}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>H2 Description</label>
            <textarea
              name="h2Desc"
              className="form-control"
              rows="2"
              value={values.h2Desc}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="col-12 mt-5 text-center">
            <button
              type="submit"
              className="btn btn-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </article>
  );
};

export default EditServiceCompany;
