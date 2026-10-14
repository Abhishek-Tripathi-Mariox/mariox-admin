import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import FormInputText from "../../../components/FormInputText";
import { addServiceImage } from "./serviceCityContentSlice";
// import { specializationCityList } from "../ManageServicesCities/serviceCitiesSlice";
import { specializationList } from "../ManageServices/serviceSlice";

const AddServiceCityImage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceCityId, setServiceCityId] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const loadSpecializationOptions = async (inputValue, callback) => {
    try {
      // const res = await dispatch(
      //   specializationCityList({
      //     page: 1,
      //     limit: 10,
      //     search: inputValue || "",
      //   })
      // );

      const res = await dispatch(
        specializationList({
          page: 1,
          limit: 10,
          search: inputValue || "",
        })
      );

      const data = res?.payload?.countries || [];

      const options = data.map((item) => ({
        value: item._id,
        label: item.pageName,
        slug: item.slug,
      }));

      callback(options);
    } catch (err) {
      console.error("Failed to load options", err);
      callback([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceCityId) {
      toast.error("Please select a service city");
      return;
    }

    if (!title.trim() || !htmlContent.trim()) {
      toast.error("Please enter title and content");
      return;
    }

    const formData = new FormData();
    formData.append("serviceCityId", serviceCityId);
    formData.append("slug", slug);
    formData.append("title", title);
    formData.append("content", htmlContent);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setIsSubmitting(true);
      const response = await dispatch(addServiceImage(formData));
      const { payload: result } = response || {};

      if (result?.code === 1) {
        toast.success("Service city image added successfully");
        navigate("/admin/manage-service-cities-content");
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
        <h2 className="head-title">Add Service City Image</h2>

        <form onSubmit={handleSubmit} className="form-style">
          <div className="row mb-4">
            <div className="col-md-6">
              <label>Select Service City</label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadSpecializationOptions}
                placeholder="Search Service City"
                onChange={(opt) => {
                  setServiceCityId(opt?.value);
                  setSlug(opt?.slug || "");
                  setSelectedOption(opt);
                }}
                value={selectedOption}
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
              placeholder="Enter service city content"
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

export default AddServiceCityImage;
