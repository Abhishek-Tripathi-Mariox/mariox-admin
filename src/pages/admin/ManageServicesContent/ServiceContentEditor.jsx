// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// import {
//   fetchServiceContentByServiceId,
//   updateServiceImage,
//   addServiceImage,
//   deleteServiceImage,
// } from "./serviceContentSlice";

// const ServiceContentEditor = () => {
//   const { serviceId } = useParams();
//   const dispatch = useDispatch();
//   const [contentList, setContentList] = useState([]);
//   const [expandedIndex, setExpandedIndex] = useState(null);

//   // Fetch initial content
//   useEffect(() => {
//     dispatch(fetchServiceContentByServiceId({ serviceId })).then((res) => {
//       console.log("res=>>", res);
//       const rawList = res?.payload?.ServiceImage || [];

//       console.log("rawList=>>", rawList);
//       const enriched = rawList.map((item) => ({
//         ...item,
//         imageFile: null,
//         imagePreview: null,
//         serviceId,
//       }));
//       setContentList(enriched);
//     });
//   }, [dispatch, serviceId]);

//   // Handle input and content changes
//   const handleChange = (index, field, value) => {
//     const updated = [...contentList];
//     updated[index][field] = value;
//     setContentList(updated);
//   };

//   const handleImageChange = (index, file) => {
//     const updated = [...contentList];
//     updated[index].imageFile = file;
//     updated[index].imagePreview = URL.createObjectURL(file);
//     setContentList(updated);
//   };

//   const toggleExpand = (index) => {
//     setExpandedIndex(index === expandedIndex ? null : index);
//   };

//   const handleDelete = async (item, index) => {
//     if (!item._id) {
//       // If item is not saved in DB yet, just remove from UI
//       const updated = contentList.filter((_, i) => i !== index);
//       setContentList(updated);
//       toast.info("Unsaved content removed");
//       return;
//     }

//     const confirm = window.confirm(
//       "Are you sure you want to delete this content?"
//     );
//     if (!confirm) return;

//     const response = await dispatch(
//       deleteServiceImage({ id: item._id, filters: { serviceId } })
//     );
//     const { payload } = response || {};

//     if (payload?.code === 1) {
//       toast.success("Deleted successfully");
//       const updated = contentList.filter((_, i) => i !== index);
//       setContentList(updated);
//     } else {
//       toast.error(payload?.message || "Failed to delete content");
//     }
//   };

//   const handleAddNew = () => {
//     const newBlock = {
//       title: "",
//       content: "",
//       image: "",
//       imageFile: null,
//       imagePreview: null,
//       serviceId,
//     };
//     setContentList([...contentList, newBlock]);
//     setExpandedIndex(contentList.length);
//   };

//   const handleSaveSingle = async (item, index) => {
//     const formData = new FormData();
//     formData.append("title", item.title);
//     formData.append("content", item.content);
//     formData.append("serviceId", item.serviceId);
//     if (item.imageFile) {
//       formData.append("image", item.imageFile);
//     }

//     try {
//       const action = item._id
//         ? updateServiceImage({ id: item._id, formData })
//         : addServiceImage(formData);

//       const response = await dispatch(action);
//       const { payload } = response || {};

//       if (payload?.code === 1) {
//         toast.success(item._id ? "Updated successfully" : "Added successfully");

//         // update local state with _id and uploaded image url if it was newly added
//         const updated = [...contentList];
//         updated[index]._id = payload?.data?._id || updated[index]._id;
//         updated[index].image = payload?.data?.image || updated[index].image;
//         updated[index].imageFile = null;
//         updated[index].imagePreview = null;
//         setContentList(updated);
//       } else {
//         toast.error(payload?.message || "Something went wrong");
//       }
//     } catch (err) {
//       toast.error("Error while saving");
//     }
//   };

//   return (
//     <article className="col-lg-9">
//       <div className="article-body">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h3>Manage Service Content</h3>
//           <button className="btn btn-outline-success" onClick={handleAddNew}>
//             + Add New
//           </button>
//         </div>

//         {contentList.map((item, index) => (
//           <div key={item._id || index} className="card mb-3">
//             <div
//               className="card-header d-flex justify-content-between align-items-center"
//               onClick={() => toggleExpand(index)}
//               style={{ cursor: "pointer" }}
//             >
//               <strong>{item.title || `Content ${index + 1}`}</strong>
//               <span>{expandedIndex === index ? "▲" : "▼"}</span>
//             </div>

//             {expandedIndex === index && (
//               <div className="card-body">
//                 <div className="mb-3">
//                   <label>Title</label>
//                   <input
//                     className="form-control"
//                     value={item.title}
//                     onChange={(e) =>
//                       handleChange(index, "title", e.target.value)
//                     }
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label>Content</label>
//                   <ReactQuill
//                     theme="snow"
//                     value={item.content}
//                     onChange={(val) => handleChange(index, "content", val)}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label>Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="form-control"
//                     onChange={(e) =>
//                       handleImageChange(index, e.target.files[0])
//                     }
//                   />
//                   {item.imagePreview ? (
//                     <img
//                       src={item.imagePreview}
//                       alt="Preview"
//                       style={{ maxWidth: "120px", marginTop: "10px" }}
//                     />
//                   ) : item.image ? (
//                     <img
//                       src={item.image}
//                       alt="Uploaded"
//                       style={{ maxWidth: "120px", marginTop: "10px" }}
//                     />
//                   ) : (
//                     <p className="text-muted mt-2">No image uploaded</p>
//                   )}
//                 </div>

//                 {/* <div className="text-end">
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => handleSaveSingle(item, index)}
//                   >
//                     {item._id ? "Update" : "Add"}
//                   </button>
//                 </div> */}

//                 <div className="text-end d-flex gap-2 justify-content-end">
//                   <button
//                     className="btn btn-danger"
//                     onClick={() => handleDelete(item, index)}
//                   >
//                     Delete
//                   </button>
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => handleSaveSingle(item, index)}
//                   >
//                     {item._id ? "Update" : "Add"}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </article>
//   );
// };

// export default ServiceContentEditor;

import { useState } from "react";
import ServiceContentManager from "./ServiceContentManager"; // You will create this
import ServiceCityContentManager from "../ManageServicesCityContent/ServiceCityContentManager"; // You will create this

const ServiceContentEditor = () => {
  const [contentType, setContentType] = useState("service");

  return (
    <article className="col-lg-9">
      <div className="article-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Manage Content</h3>
          <select
            className="form-select w-auto"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          >
            <option value="service">Service Content</option>
            <option value="city">Service City Content</option>
          </select>
        </div>

        {contentType === "service" ? (
          <ServiceContentManager />
        ) : (
          <ServiceCityContentManager />
        )}
      </div>
    </article>
  );
};

export default ServiceContentEditor;
