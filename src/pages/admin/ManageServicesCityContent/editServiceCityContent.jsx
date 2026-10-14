import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import FormInputText from "../../../components/FormInputText";
import {
  updateServiceImage,
  serviceCityImageDetail,
} from "./serviceCityContentSlice";
import { specializationList } from "../ManageServices/serviceSlice";

const EditServiceImage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  // const specializationData = useSelector(
  //   (state) => state.service.specializationList || []
  // );

  useEffect(() => {
    dispatch(specializationList({ page: 1, limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(serviceCityImageDetail({ id })).then((res) => {
        const data = res?.payload?.data;
        if (data) {
          setServiceId(data.serviceId);
          setTitle(data.title);
          setHtmlContent(data.content);
          setExistingImage(data.image);
        }
      });
    }
  }, [dispatch, id]);

  // const specializationOptions = specializationData.map((spec) => ({
  //   value: spec._id,
  //   label: spec.pageName,
  // }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!serviceId) {
    //   toast.error("Please select a service");
    //   return;
    // }

    if (!title.trim() || !htmlContent.trim()) {
      toast.error("Please enter title and content");
      return;
    }

    const formData = new FormData();
    formData.append("serviceId", serviceId);
    formData.append("title", title);
    formData.append("content", htmlContent);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setIsSubmitting(true);

      // console.log("formData=>>>>>>>>,", formData);
      const response = await dispatch(updateServiceImage({ id, formData }));
      const { payload: result } = response || {};

      if (result?.code === 1) {
        toast.success("Service image updated successfully");
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
        <h2 className="head-title">Edit Service Image</h2>

        <form onSubmit={handleSubmit} className="form-style">
          {/* <div className="row mb-4">
            <div className="col-md-6">
              <label>Select Service</label>
              <Select
                options={specializationOptions}
                placeholder="Select Service"
                onChange={(opt) => setServiceId(opt?.value)}
                value={specializationOptions.find(
                  (opt) => opt.value === serviceId
                )}
              />
            </div>
          </div> */}

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
            {existingImage && !imageFile && (
              <div className="mt-2">
                <img
                  src={existingImage}
                  alt="Existing"
                  style={{
                    width: "200px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            )}
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

export default EditServiceImage;
