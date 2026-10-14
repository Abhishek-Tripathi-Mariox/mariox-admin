import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from "react-js-pagination";
import { specializationDetails } from "./serviceSlice";
import CollapsibleSection from "../../../components/CollapsibleSection";

// A service stores 11 parallel copies of every content block. The field-name
// infix is historical (no infix, then Z, A, B ... I) while the labels shown to
// the admin run Default, A, B ... J — keep the two columns in sync.
const VARIANTS = [
  { key: "", label: "Default" },
  { key: "Z", label: "A" },
  { key: "A", label: "B" },
  { key: "B", label: "C" },
  { key: "C", label: "D" },
  { key: "D", label: "E" },
  { key: "E", label: "F" },
  { key: "F", label: "G" },
  { key: "G", label: "H" },
  { key: "H", label: "I" },
  { key: "I", label: "J" },
];

const ABOUT_PARTS = [1, 2, 3, 4, 5, 6];

const variantFields = (key) => ({
  seo: `seo${key}Meta`,
  h1Text: `h1${key}Text`,
  h1Desc: `h1${key}Desc`,
  h2Text: `h2${key}Text`,
  h2Desc: `h2${key}Desc`,
  about: `about${key}Service`,
  aboutParts: ABOUT_PARTS.map((part) => `about${key}Service${part}`),
});

const hasVariantContent = (data, key) => {
  if (!data) return false;
  const field = variantFields(key);
  const seo = data[field.seo];
  const seoFilled = Boolean(
    seo &&
      (seo.title ||
        seo.description ||
        seo.keywords?.length ||
        seo.robots?.length)
  );

  return (
    seoFilled ||
    Boolean(data[field.h1Text]) ||
    Boolean(data[field.h1Desc]) ||
    Boolean(data[field.h2Text]) ||
    Boolean(data[field.h2Desc]) ||
    Boolean(data[field.about]) ||
    field.aboutParts.some((name) => Boolean(data[name]))
  );
};

const ServiceDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [params, setParams] = useState(null);
  const [page, setPage] = useState(1);
  const variantRef = useRef(null);

  useEffect(() => {
    if (id) {
      setPage(1);
      dispatch(specializationDetails({ id })).then((res) => {
        const data = res?.payload;
        if (data) setParams(data);
      });
    }
  }, [dispatch, id]);

  // Only page through the variants that actually carry content — a service
  // typically fills two or three of the eleven.
  const visibleVariants = useMemo(() => {
    if (!params) return [];
    const filled = VARIANTS.filter((variant) =>
      hasVariantContent(params, variant.key)
    );
    return filled.length > 0 ? filled : [VARIANTS[0]];
  }, [params]);

  const totalVariants = visibleVariants.length;
  const hiddenCount = VARIANTS.length - totalVariants;
  const currentPage = Math.min(page, totalVariants) || 1;
  const variant = visibleVariants[currentPage - 1];

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    variantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderBox = (label, value) => (
    <div className="col-md-6 mb-3">
      <label className="form-label fw-bold">{label}</label>
      <input
        type="text"
        className="form-control"
        readOnly
        value={value || "-"}
      />
    </div>
  );

  const renderHTML = (label, html) => (
    <div className="col-12 mb-3">
      <label className="fw-bold d-block mb-1">{label}</label>
      <div
        className="border p-3 rounded bg-light"
        dangerouslySetInnerHTML={{ __html: html || "-" }}
      />
    </div>
  );

  const renderSEO = (key, label) => {
    const seo = params?.[key];
    if (!seo) return null;

    return (
      <div className="col-12 p-3 border rounded mb-4 bg-light-subtle">
        <h5 className="mb-3">{label} SEO</h5>
        <div className="row">
          {renderBox("Title", seo.title)}
          {renderBox("Description", seo.description)}
          {renderBox("Keywords", (seo.keywords || []).join(", "))}
          {renderBox("Robots", (seo.robots || []).join(", "))}
        </div>
      </div>
    );
  };

  const renderAboutServiceParts = (prefix, label) => {
    const parts = ABOUT_PARTS.filter((part) => params?.[`${prefix}${part}`]);
    if (parts.length === 0) return null;

    return (
      <div className="col-12 mb-4">
        <div className="card border-primary">
          <div className="card-header bg-primary text-white">
            <h6 className="mb-0">
              {label} - {parts.length} Part{parts.length > 1 ? "s" : ""}
            </h6>
          </div>
          <div className="card-body">
            {parts.map((part) => {
              const fieldName = `${prefix}${part}`;

              return (
                <div key={fieldName} className="mb-3">
                  <label className="fw-bold d-block mb-2 text-primary">
                    Part {part}
                  </label>
                  <div
                    className="border p-3 rounded bg-white"
                    dangerouslySetInnerHTML={{ __html: params[fieldName] }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (!params) return null;

  const field = variantFields(variant.key);

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row">
          <div className="col-sm-12">
            <h2 className="head-title">Service Details</h2>
            <form className="form-style row">
              {renderBox("Service Name", params.pageName)}
              {renderBox("Slug", params.slug)}
              {renderBox("Title", params.title)}
              {renderBox("SCM", params.scm)}
              {renderBox("Canonical Link", params?.links?.canonical)}
              {renderBox("Status", params.status ? "Active" : "Inactive")}
              {renderBox("Top Service", params.isTopService ? "Yes" : "No")}

              <div className="col-12" ref={variantRef}>
                <div className="d-flex justify-content-between align-items-center flex-wrap border rounded bg-light p-3 my-3">
                  <div>
                    <h5 className="mb-1">Content Variant: {variant.label}</h5>
                    <small className="text-muted">
                      {currentPage} of {totalVariants}
                      {hiddenCount > 0
                        ? ` — ${hiddenCount} empty variant${
                            hiddenCount > 1 ? "s" : ""
                          } hidden`
                        : ""}
                    </small>
                  </div>
                  <div className="d-flex flex-wrap">
                    {visibleVariants.map((item, index) => (
                      <button
                        key={item.label}
                        type="button"
                        className={`btn btn-sm me-1 mb-1 ${
                          index + 1 === currentPage
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <CollapsibleSection title={`${variant.label} — SEO`}>
                  {renderSEO(field.seo, variant.label)}
                </CollapsibleSection>

                <CollapsibleSection title={`${variant.label} — H1 Heading`}>
                  {renderBox("H1 Text", params[field.h1Text])}
                  {renderBox("H1 Description", params[field.h1Desc])}
                </CollapsibleSection>

                <CollapsibleSection title={`${variant.label} — H2 Heading`}>
                  {renderBox("H2 Text", params[field.h2Text])}
                  {renderBox("H2 Description", params[field.h2Desc])}
                </CollapsibleSection>

                <CollapsibleSection
                  title={`${variant.label} — About Service (Original)`}
                >
                  {renderHTML("About Service", params[field.about])}
                </CollapsibleSection>

                <CollapsibleSection
                  title={`${variant.label} — About Service (6 Parts)`}
                >
                  {renderAboutServiceParts(
                    field.about,
                    `About Service ${variant.label}`
                  )}
                </CollapsibleSection>

                {totalVariants > 1 && (
                  <div className="d-flex justify-content-center my-3">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={1}
                      totalItemsCount={totalVariants}
                      pageRangeDisplayed={VARIANTS.length}
                      onChange={handlePageChange}
                    />
                  </div>
                )}
              </div>

              {renderBox(
                "Created At",
                new Date(params.createdAt).toLocaleString()
              )}
              {renderBox(
                "Updated At",
                new Date(params.updatedAt).toLocaleString()
              )}
            </form>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceDetails;
