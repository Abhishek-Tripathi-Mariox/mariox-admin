import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import FormInputText from "../../../components/FormInputText";
import { addServiceImage } from "./serviceContentSlice";
import { specializationList } from "../ManageServices/serviceSlice";

const AddServiceImage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [slug, setSlug] = useState("");

  const specializationData = useSelector(
    (state) => state.service.specializationList || []
  );

  useEffect(() => {
    dispatch(specializationList({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const specializationOptions = specializationData.map((spec) => ({
    value: spec._id,
    label: spec.pageName,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceId) {
      toast.error("Please select a service");
      return;
    }

    if (!title.trim() || !htmlContent.trim()) {
      toast.error("Please enter title and content");
      return;
    }

    const formData = new FormData();
    formData.append("serviceId", serviceId);
    formData.append("title", title);
    formData.append("content", htmlContent);
    formData.append("slug", slug);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setIsSubmitting(true);
      const response = await dispatch(addServiceImage(formData));
      const { payload: result } = response || {};

      if (result?.code === 1) {
        toast.success("Service image added successfully");
        navigate("/admin/manage-services-content");
      } else {
        toast.error(result?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <h2 className="head-title">Add Service Image</h2>

        <form onSubmit={handleSubmit} className="form-style">
          <div className="row mb-4">
            <div className="col-md-6">
              <label>Select Service</label>
              <Select
                options={specializationOptions}
                placeholder="Select Service"
                onChange={(opt) => {
                  setServiceId(opt?.value);
                  const selected = specializationData.find(
                    (s) => s._id === opt?.value
                  );
                  setSlug(selected?.slug || ""); // ✅ use existing slug
                }}
                value={specializationOptions.find(
                  (opt) => opt.value === serviceId
                )}
              />
            </div>
          </div>

          <FormInputText
            placeholder="Enter Title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            title="Title"
          />

          <div className="mb-3">
            <label>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label>Content</label>
            <ReactQuill
              theme="snow"
              value={htmlContent}
              onChange={setHtmlContent}
              placeholder="Enter service content"
            />
          </div>

          <div className="text-center mt-4">
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

export default AddServiceImage;
