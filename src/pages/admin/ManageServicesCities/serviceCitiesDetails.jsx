// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { useDispatch } from "react-redux";
// // import { specializationCityDetails } from "./serviceCitiesSlice";

// // const ServiceCityDetails = () => {
// //   const { id } = useParams();
// //   const dispatch = useDispatch();
// //   const [params, setParams] = useState({});

// //   useEffect(() => {
// //     if (id) {
// //       dispatch(specializationCityDetails({ id })).then((res) => {
// //         const data = res?.payload;
// //         if (data) {
// //           setParams(data);
// //         }
// //       });
// //     }
// //   }, [dispatch, id]);

// //   const renderField = (label, value, required = false) => (
// //     <div className="mb-4 col-12">
// //       <label className="form-label fw-semibold">
// //         {label}
// //         {required && <span className="text-danger ms-1">*</span>}
// //       </label>
// //       <div className="form-control bg-light-subtle border rounded px-3 py-2">
// //         {value || "-"}
// //       </div>
// //     </div>
// //   );

// //   const renderHTML = (label, html) => (
// //     <div className="mb-4 col-12">
// //       <label className="form-label fw-semibold">{label}</label>
// //       <div
// //         className="form-control bg-light-subtle border rounded px-3 py-2"
// //         dangerouslySetInnerHTML={{ __html: html || "-" }}
// //       />
// //     </div>
// //   );

// //   return (
// //     <article className="col-lg-9">
// //       <div className="article-body store-bd-gy">
// //         <h2 className="head-title text-danger text-center mb-4">
// //           Service City Details
// //         </h2>
// //         <div className="row">
// //           {renderField("Page Name", params.pageName, true)}
// //           {renderField("Slug", params.slug)}
// //           {renderField("Service Name", params.serviceName)}
// //           {renderField("City Name", params.cityName)}
// //           {renderField("Status", params.status ? "Active" : "Inactive")}
// //           {renderField("Service Slug", params.serviceSlug)}
// //           {renderField("City Slug", params.citySlug)}
// //           {renderField("H1 Text", params.h1Text)}
// //           {renderField("H1 Description", params.h1Desc)}
// //           {renderField("H2 Text", params.h2Text)}
// //           {renderField("About Type", params.aboutName)}
// //           {renderField("SEO Title", params?.seoMeta?.title)}
// //           {renderField("SEO Description", params?.seoMeta?.description)}
// //           {renderField(
// //             "SEO Keywords",
// //             (params?.seoMeta?.keywords || []).join(", ")
// //           )}
// //           {renderField(
// //             "SEO Robots",
// //             (params?.seoMeta?.robots || []).join(", ")
// //           )}
// //           {renderField(
// //             "Created At",
// //             params.createdAt ? new Date(params.createdAt).toLocaleString() : "-"
// //           )}
// //           {renderField(
// //             "Updated At",
// //             params.updatedAt ? new Date(params.updatedAt).toLocaleString() : "-"
// //           )}
// //           {/* {renderHTML("About Service", params.aboutService)} */}
// //           {renderHTML("About Page", params.aboutPage)}
// //         </div>
// //       </div>
// //     </article>
// //   );
// // };

// // export default ServiceCityDetails;

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { specializationCityDetails } from "./serviceCitiesSlice";

// const ServiceCityDetails = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const [params, setParams] = useState({});

//   useEffect(() => {
//     if (id) {
//       dispatch(specializationCityDetails({ id })).then((res) => {
//         const data = res?.payload;
//         if (data) {
//           setParams(data);
//         }
//       });
//     }
//   }, [dispatch, id]);

//   const renderField = (label, value, required = false) => (
//     <div className="mb-4 col-12">
//       <label className="form-label fw-semibold">
//         {label}
//         {required && <span className="text-danger ms-1">*</span>}
//       </label>
//       <div className="form-control bg-light-subtle border rounded px-3 py-2">
//         {value || "-"}
//       </div>
//     </div>
//   );

//   const renderBox = (label) => (
//     <div className="mb-2 col-12">
//       <label className="form-label fw-semibold">{label}</label>
//       {/* <div className="form-control bg-light-subtle border rounded px-3 py-2">
//         {value || "-"}
//       </div> */}
//     </div>
//   );

//   const renderHTML = (label) => (
//     <div className="mb-2 col-12">
//       <label className="form-label fw-semibold">{label}</label>
//       {/* <div
//         className="form-control bg-light-subtle border rounded px-3 py-2"
//         dangerouslySetInnerHTML={{ __html: html || "-" }}
//       /> */}
//     </div>
//   );

//   // Helper functions to convert dynamic key names to friendly labels
//   const getSEOLabelFromKey = (key = "") => {
//     if (key === "seoMeta") return "SEO Default";
//     const match = key.match(/^seo([A-Z])Meta$/);
//     if (!match) return "SEO";
//     const code = match[1];
//     const label =
//       code === "Z" ? "A" : String.fromCharCode(code.charCodeAt(0) + 1);
//     return `SEO ${label}`;
//   };

//   const getHeadingLabel = (key = "", prefix = "") => {
//     const match = key.match(new RegExp(`^${prefix}([A-Z]?)Text$`));
//     if (!match) return `${prefix.toUpperCase()} Text`;
//     const code = match[1];
//     if (!code) return `${prefix.toUpperCase()} Text`;
//     const label =
//       code === "Z" ? "A" : String.fromCharCode(code.charCodeAt(0) + 1);
//     return `${prefix.toUpperCase()} ${label} Text`;
//   };

//   const getDescLabel = (key = "", prefix = "") => {
//     const match = key.match(new RegExp(`^${prefix}([A-Z]?)Desc$`));
//     if (!match) return `${prefix.toUpperCase()} Description`;
//     const code = match[1];
//     if (!code) return `${prefix.toUpperCase()} Description`;
//     const label =
//       code === "Z" ? "A" : String.fromCharCode(code.charCodeAt(0) + 1);
//     return `${prefix.toUpperCase()} ${label} Description`;
//   };

//   const getAboutLabel = (key = "") => {
//     const match = key.match(/^about([A-Z]?)Service$/);
//     if (!match) return "About Service";
//     const code = match[1];
//     const label =
//       code === "Z" ? "A" : String.fromCharCode(code.charCodeAt(0) + 1);
//     return `About ${label} Service`;
//   };

//   return (
//     <article className="col-lg-9">
//       <div className="article-body store-bd-gy">
//         <h2 className="head-title text-danger text-center mb-4">
//           Service City Details
//         </h2>
//         <div className="row">
//           {renderField("Page Name", params.pageName, true)}
//           {renderField("Slug", params.slug)}
//           {renderField("Service Name", params.serviceName)}
//           {renderField("City Name", params.cityName)}
//           {renderField("Status", params.status ? "Active" : "Inactive")}
//           {renderField("Service Slug", params.serviceSlug)}
//           {renderField("City Slug", params.citySlug)}

//           {renderBox(
//             getHeadingLabel(params.h1Name, "h1"),
//             params[params.h1Name]
//           )}
//           {renderBox(
//             getDescLabel(params.h1DescName, "h1"),
//             params[params.h1DescName]
//           )}

//           {renderBox(
//             getHeadingLabel(params.h2Name, "h2"),
//             params[params.h2Name]
//           )}
//           {renderBox(
//             getDescLabel(params.h2DescName, "h2"),
//             params[params.h2DescName]
//           )}

//           {renderHTML(
//             getAboutLabel(params.aboutName),
//             params[params.aboutName]
//           )}

//           {renderBox(
//             getSEOLabelFromKey(params.seoMetaName),
//             params[params.seoMetaName]
//           )}

//           {renderField(
//             "Created At",
//             params.createdAt ? new Date(params.createdAt).toLocaleString() : "-"
//           )}
//           {renderField(
//             "Updated At",
//             params.updatedAt ? new Date(params.updatedAt).toLocaleString() : "-"
//           )}
//         </div>
//       </div>
//     </article>
//   );
// };

// export default ServiceCityDetails;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  specializationCityDetails,
  updateSpecializationCity,
} from "./serviceCitiesSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const ServiceCityDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [params, setParams] = useState({});
  const [showAboutEditor, setShowAboutEditor] = useState(false);
  const [aboutValue, setAboutValue] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(specializationCityDetails({ id })).then((res) => {
        const data = res?.payload;
        if (data) {
          setParams(data);
        }
      });
    }
  }, [dispatch, id]);

  // 👉 Edit About handlers
  const handleEditAbout = () => {
    setAboutValue(params[params.aboutName] || ""); // preload earlier value
    setShowAboutEditor(true);
  };

  const handleSaveAbout = async () => {
    try {
      const res = await dispatch(
        updateSpecializationCity({
          id: params._id,
          data: { aboutName: aboutValue },
        })
      );
      if (res.payload?.code === 1) {
        toast.success("About section updated successfully!");
        setShowAboutEditor(false);
        setParams((prev) => ({ ...prev, [params.aboutName]: aboutValue }));
      } else {
        toast.error(res.payload?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const renderField = (label, value, required = false) => (
    <div className="mb-4 col-12">
      <label className="form-label fw-semibold">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <div className="form-control bg-light-subtle border rounded px-3 py-2">
        {value || "-"}
      </div>
    </div>
  );

  const renderHTML = (label, html) => (
    <div className="mb-4 col-12">
      <label className="form-label fw-semibold">{label}</label>
      <div
        className="form-control bg-light-subtle border rounded px-3 py-2"
        dangerouslySetInnerHTML={{ __html: html || "-" }}
      />
    </div>
  );

  const renderBox = (label) => (
    <div className="mb-2 col-12">
      <label className="form-label fw-semibold">{label}</label>
      {/* <div className="form-control bg-light-subtle border rounded px-3 py-2">
        {value || "-"}
      </div> */}
    </div>
  );

  const getHeadingLabel = (key = "", prefix = "") => {
    const match = key.match(new RegExp(`^${prefix}([A-Z]?)Text$`));
    if (!match) return `${prefix.toUpperCase()} Text`;
    const code = match[1];
    if (!code) return `${prefix.toUpperCase()} Text`;
    const label =
      code === "Z" ? "A" : String.fromCharCode(code.charCodeAt(0) + 1);
    return `${prefix.toUpperCase()} ${label} Text`;
  };

  const getAboutLabel = (key = "") => {
    const match = key.match(/^about([A-Z]?)Service$/);
    if (!match) return "About Service";
    const code = match[1];
    const label =
      code === "Z" ? "A" : String.fromCharCode(code.charCodeAt(0) + 1);
    return `About ${label} Service`;
  };

  const getDescLabel = (key = "", prefix = "") => {
    const match = key.match(new RegExp(`^${prefix}([A-Z]?)Desc$`));
    if (!match) return `${prefix.toUpperCase()} Description`;
    const code = match[1];
    if (!code) return `${prefix.toUpperCase()} Description`;
    const label =
      code === "Z" ? "A" : String.fromCharCode(code.charCodeAt(0) + 1);
    return `${prefix.toUpperCase()} ${label} Description`;
  };

  const getSEOLabelFromKey = (key = "") => {
    if (key === "seoMeta") return "SEO Default";
    const match = key.match(/^seo([A-Z])Meta$/);
    if (!match) return "SEO";
    const code = match[1];
    const label =
      code === "Z" ? "A" : String.fromCharCode(code.charCodeAt(0) + 1);
    return `SEO ${label}`;
  };
  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <h2 className="head-title text-danger text-center mb-4">
          Service City Details
        </h2>
        <div className="row">
          {renderField("Page Name", params.pageName, true)}
          {renderField("Slug", params.slug)}
          {renderField("Service Name", params.serviceName)}
          {renderField("City Name", params.cityName)}
          {renderField("Status", params.status ? "Active" : "Inactive")}
          {renderField("Service Slug", params.serviceSlug)}
          {renderField("City Slug", params.citySlug)}

          {renderBox(
            getHeadingLabel(params.h1Name, "h1"),
            params[params.h1Name]
          )}
          {renderBox(
            getDescLabel(params.h1DescName, "h1"),
            params[params.h1DescName]
          )}

          {renderBox(
            getHeadingLabel(params.h2Name, "h2"),
            params[params.h2Name]
          )}
          {renderBox(
            getDescLabel(params.h2DescName, "h2"),
            params[params.h2DescName]
          )}

          {/* About Section with HTML + Edit Button */}

          {renderHTML(
            "About Service",
            params.aboutName || getAboutLabel(params.aboutName)
          )}

          <div className="col-12 mb-4">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleEditAbout}
            >
              ✏️ Edit About
            </button>
          </div>

          {renderBox(
            getSEOLabelFromKey(params.seoMetaName),
            params[params.seoMetaName]
          )}

          {renderField(
            "Created At",
            params.createdAt ? new Date(params.createdAt).toLocaleString() : "-"
          )}
          {renderField(
            "Updated At",
            params.updatedAt ? new Date(params.updatedAt).toLocaleString() : "-"
          )}
        </div>
      </div>

      {/* Modal for editing About */}
      {showAboutEditor && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">
              <h5>Edit About Section</h5>

              <ReactQuill
                theme="snow"
                value={aboutValue}
                onChange={setAboutValue}
                className="bg-white"
              />

              <div className="mt-3 text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowAboutEditor(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleSaveAbout}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default ServiceCityDetails;
