import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { addSpecialization } from "./serviceSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import CollapsibleSection from "../../../components/CollapsibleSection";

const generateSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const AddService = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    pageName: Yup.string().required("*Service Name is required"),
    slug: Yup.string().required("*Slug is required"),
    aboutService: Yup.string().required("*About Service is required"),
  });

  const formik = useFormik({
    initialValues: {
      pageName: "",
      slug: "",
      title: "",
      status: true,
      isTopService: false,
      seoMeta: { title: "", description: "", keywords: [], robots: [] },
      seoZMeta: { title: "", description: "", keywords: [], robots: [] },
      seoAMeta: { title: "", description: "", keywords: [], robots: [] },
      seoBMeta: { title: "", description: "", keywords: [], robots: [] },
      seoCMeta: { title: "", description: "", keywords: [], robots: [] },
      seoDMeta: { title: "", description: "", keywords: [], robots: [] },
      seoEMeta: { title: "", description: "", keywords: [], robots: [] },
      seoFMeta: { title: "", description: "", keywords: [], robots: [] },
      seoGMeta: { title: "", description: "", keywords: [], robots: [] },
      seoHMeta: { title: "", description: "", keywords: [], robots: [] },
      seoIMeta: { title: "", description: "", keywords: [], robots: [] },
      h1Text: "",
      h1ZText: "",
      h1AText: "",
      h1BText: "",
      h1CText: "",
      h1DText: "",
      h1EText: "",
      h1FText: "",
      h1GText: "",
      h1HText: "",
      h1IText: "",
      h2Text: "",
      h2ZText: "",
      h2AText: "",
      h2BText: "",
      h2CText: "",
      h2DText: "",
      h2EText: "",
      h2FText: "",
      h2GText: "",
      h2HText: "",
      h2IText: "",
      h1Desc: "",
      h1ZDesc: "",
      h1ADesc: "",
      h1BDesc: "",
      h1CDesc: "",
      h1DDesc: "",
      h1EDesc: "",
      h1FDesc: "",
      h1GDesc: "",
      h1HDesc: "",
      h1IDesc: "",
      h2Desc: "",
      h2ZDesc: "",
      h2ADesc: "",
      h2BDesc: "",
      h2CDesc: "",
      h2DDesc: "",
      h2EDesc: "",
      h2FDesc: "",
      h2GDesc: "",
      h2HDesc: "",
      h2IDesc: "",
      aboutService: "",
      aboutZService: "",
      aboutAService: "",
      aboutBService: "",
      aboutCService: "",
      aboutDService: "",
      aboutEService: "",
      aboutFService: "",
      aboutGService: "",
      aboutHService: "",
      aboutIService: "",
      // Updated: 6 parts each
      aboutService1: "",
      aboutService2: "",
      aboutService3: "",
      aboutService4: "",
      aboutService5: "",
      aboutService6: "",

      aboutZService1: "",
      aboutZService2: "",
      aboutZService3: "",
      aboutZService4: "",
      aboutZService5: "",
      aboutZService6: "",

      aboutAService1: "",
      aboutAService2: "",
      aboutAService3: "",
      aboutAService4: "",
      aboutAService5: "",
      aboutAService6: "",

      aboutBService1: "",
      aboutBService2: "",
      aboutBService3: "",
      aboutBService4: "",
      aboutBService5: "",
      aboutBService6: "",

      aboutCService1: "",
      aboutCService2: "",
      aboutCService3: "",
      aboutCService4: "",
      aboutCService5: "",
      aboutCService6: "",

      aboutDService1: "",
      aboutDService2: "",
      aboutDService3: "",
      aboutDService4: "",
      aboutDService5: "",
      aboutDService6: "",

      aboutEService1: "",
      aboutEService2: "",
      aboutEService3: "",
      aboutEService4: "",
      aboutEService5: "",
      aboutEService6: "",

      aboutFService1: "",
      aboutFService2: "",
      aboutFService3: "",
      aboutFService4: "",
      aboutFService5: "",
      aboutFService6: "",

      aboutGService1: "",
      aboutGService2: "",
      aboutGService3: "",
      aboutGService4: "",
      aboutGService5: "",
      aboutGService6: "",

      aboutHService1: "",
      aboutHService2: "",
      aboutHService3: "",
      aboutHService4: "",
      aboutHService5: "",
      aboutHService6: "",

      aboutIService1: "",
      aboutIService2: "",
      aboutIService3: "",
      aboutIService4: "",
      aboutIService5: "",
      aboutIService6: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const response = await dispatch(addSpecialization(values));
      const { payload } = response || {};
      if (payload?.code === 1) {
        toast.success("Service added successfully");
        navigate("/admin/manage-services");
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
    if (values.pageName && !touched.slug) {
      setFieldValue("slug", generateSlug(values.pageName));
    }
  }, [values.pageName, touched.slug]);

  const renderInput = (name, label) => (
    <div className="col-md-6 mb-3">
      <label>{label}</label>
      <input
        type="text"
        name={name}
        className="form-control"
        placeholder={label}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
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
        value={values[name]}
        onChange={(content) => setFieldValue(name, content)}
        onBlur={() => formik.setFieldTouched(name, true)}
        className="bg-white"
      />
      {touched[name] && errors[name] && (
        <div className="errorMessage">{errors[name]}</div>
      )}
    </div>
  );

  const renderSEOBlock = (key, label) => (
    <div className="col-12 p-3 border rounded mb-4 bg-light-subtle">
      <h5 className="mb-3">{label} SEO</h5>
      <div className="row">
        {renderInput(`${key}.title`, "Title")}
        {renderInput(`${key}.description`, "Description")}
        <div className="col-md-6 mb-3">
          <label>Keywords (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            value={values[key]?.keywords?.join(", ")}
            onChange={(e) =>
              setFieldValue(
                `${key}.keywords`,
                e.target.value.split(",").map((k) => k.trim())
              )
            }
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Robots (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            value={values[key]?.robots?.join(", ")}
            onChange={(e) =>
              setFieldValue(
                `${key}.robots`,
                e.target.value.split(",").map((r) => r.trim())
              )
            }
          />
        </div>
      </div>
    </div>
  );

  const renderDescriptionBlock = (mainField, label, variants) => (
    <>
      {renderInput(mainField, `${label} Description`)}
      <div className="col-12 p-3 border rounded mb-4 bg-light-subtle">
        <div className="row">
          {variants.map((field, idx) => (
            <div className="col-md-6 mb-3" key={field}>
              <label>{`${label} ${String.fromCharCode(
                65 + idx
              )} Description`}</label>
              <input
                type="text"
                className="form-control"
                name={field}
                value={values[field]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched[field] && errors[field] && (
                <div className="errorMessage">{errors[field]}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderAboutServiceBlock = (prefix, label) => (
    <div className="col-12 mb-4">
      <div className="card">
        <div className="card-header bg-info text-white">
          <h6 className="mb-0">{label}</h6>
        </div>
        <div className="card-body">
          {/* Parent Field */}
          <div className="mb-4 p-3 border rounded bg-light-subtle">
            <label className="form-label fw-bold text-muted mb-2">
              {label} (Original/Parent Field)
            </label>
            <ReactQuill
              theme="snow"
              value={values[prefix]}
              onChange={(content) => setFieldValue(prefix, content)}
              onBlur={() => formik.setFieldTouched(prefix, true)}
              className="bg-white"
            />
            {touched[prefix] && errors[prefix] && (
              <div className="errorMessage">{errors[prefix]}</div>
            )}
          </div>

          {/* Parts */}
          <div className="border-top pt-3">
            <h6 className="text-primary mb-3">6-Part Breakdown</h6>
            {[1, 2, 3, 4, 5, 6].map((part) => (
              <div className="mb-3" key={`${prefix}${part}`}>
                <label className="form-label fw-semibold">Part {part}</label>
                <ReactQuill
                  theme="snow"
                  value={values[`${prefix}${part}`]}
                  onChange={(content) =>
                    setFieldValue(`${prefix}${part}`, content)
                  }
                  onBlur={() =>
                    formik.setFieldTouched(`${prefix}${part}`, true)
                  }
                  className="bg-white"
                />
                {touched[`${prefix}${part}`] && errors[`${prefix}${part}`] && (
                  <div className="errorMessage">
                    {errors[`${prefix}${part}`]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <h2 className="head-title">Add New Service</h2>
        <form onSubmit={handleSubmit} className="form-style row">
          {renderInput("pageName", "Service Name")}
          {renderInput("slug", "Slug")}
          {renderInput("title", "Title")}

          <div className="col-12">
            <CollapsibleSection title="SEO Blocks">
              {renderSEOBlock("seoMeta", "Default")}
              {renderSEOBlock("seoZMeta", "A")}
              {renderSEOBlock("seoAMeta", "B")}
              {renderSEOBlock("seoBMeta", "C")}
              {renderSEOBlock("seoCMeta", "D")}
              {renderSEOBlock("seoDMeta", "E")}
              {renderSEOBlock("seoEMeta", "F")}
              {renderSEOBlock("seoFMeta", "G")}
              {renderSEOBlock("seoGMeta", "H")}
              {renderSEOBlock("seoHMeta", "I")}
              {renderSEOBlock("seoIMeta", "J")}
            </CollapsibleSection>

            <CollapsibleSection title="H1 Headings">
              {renderInput("h1Text", "H1 Main")}
              <div className="row">
                {[
                  "h1ZText",
                  "h1AText",
                  "h1BText",
                  "h1CText",
                  "h1DText",
                  "h1EText",
                  "h1FText",
                  "h1GText",
                  "h1HText",
                  "h1IText",
                ].map((f, i) =>
                  renderInput(f, `H1 ${String.fromCharCode(65 + i)}`)
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="H2 Headings">
              {renderInput("h2Text", "H2 Main")}
              <div className="row">
                {[
                  "h2ZText",
                  "h2AText",
                  "h2BText",
                  "h2CText",
                  "h2DText",
                  "h2EText",
                  "h2FText",
                  "h2GText",
                  "h2HText",
                  "h2IText",
                ].map((f, i) =>
                  renderInput(f, `H2 ${String.fromCharCode(65 + i)}`)
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="H1 Descriptions">
              {renderDescriptionBlock("h1Desc", "H1", [
                "h1ZDesc",
                "h1ADesc",
                "h1BDesc",
                "h1CDesc",
                "h1DDesc",
                "h1EDesc",
                "h1FDesc",
                "h1GDesc",
                "h1HDesc",
                "h1IDesc",
              ])}
            </CollapsibleSection>

            <CollapsibleSection title="H2 Descriptions">
              {renderDescriptionBlock("h2Desc", "H2", [
                "h2ZDesc",
                "h2ADesc",
                "h2BDesc",
                "h2CDesc",
                "h2DDesc",
                "h2EDesc",
                "h2FDesc",
                "h2GDesc",
                "h2HDesc",
                "h2IDesc",
              ])}
            </CollapsibleSection>

            {/* Combined: Parent + 4-Part About Service Sections */}
            <CollapsibleSection title="About Service Content">
              {renderAboutServiceBlock("aboutService", "Main Service")}
              {renderAboutServiceBlock("aboutZService", "Service A")}
              {renderAboutServiceBlock("aboutAService", "Service B")}
              {renderAboutServiceBlock("aboutBService", "Service C")}
              {renderAboutServiceBlock("aboutCService", "Service D")}
              {renderAboutServiceBlock("aboutDService", "Service E")}
              {renderAboutServiceBlock("aboutEService", "Service F")}
              {renderAboutServiceBlock("aboutFService", "Service G")}
              {renderAboutServiceBlock("aboutGService", "Service H")}
              {renderAboutServiceBlock("aboutHService", "Service I")}
              {renderAboutServiceBlock("aboutIService", "Service J")}
            </CollapsibleSection>
          </div>

          <div className="col-md-6 mt-3 d-flex align-items-center">
            <label className="d-flex align-items-center gap-2">
              <input
                type="checkbox"
                name="isTopService"
                checked={values.isTopService}
                onChange={(e) =>
                  setFieldValue("isTopService", e.target.checked)
                }
                className="toggle"
              />
              <span>Is Top Service</span>
            </label>
          </div>

          <div className="col-md-6 mt-3 d-flex align-items-center">
            <label className="d-flex align-items-center gap-2">
              <input
                type="checkbox"
                name="status"
                checked={values.status}
                onChange={(e) => setFieldValue("status", e.target.checked)}
                className="toggle"
              />
              <span>Status</span>
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
        </form>
      </div>
    </article>
  );
};

export default AddService;
