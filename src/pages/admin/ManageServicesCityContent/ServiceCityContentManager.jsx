// ServiceCityContentManager.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import {
  addServiceImage as addServiceCityImage,
  updateServiceImage as updateServiceCityImage,
  deleteServiceImage as deleteServiceCityImage,
  serviceCityImageList,
} from "./serviceCityContentSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const PER_PAGE = 10;

const makeNewBlock = (serviceId) => ({
  title: "",
  content: "",
  image: "",
  imageFile: null,
  imagePreview: null,
  serviceId,
});

const ServiceCityContentManager = () => {
  const { serviceId } = useParams(); // 🚨 Fetching by serviceId
  const dispatch = useDispatch();

  // contentList holds only the current page's blocks, plus any unsaved block
  // the admin just created. Every handler indexes into it directly.
  const [contentList, setContentList] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const listRef = useRef(null);
  // Set when "+ Add New" has to switch pages first: the blank block is
  // appended once the destination page finishes loading.
  const addAfterLoadRef = useRef(false);

  const loadPage = useCallback(
    (pageNo) =>
      dispatch(
        serviceCityImageList({ serviceId, page: pageNo, limit: PER_PAGE })
      ).then((res) => {
        const data = res?.payload || {};
        const enriched = (data.ServiceCitiesImage || []).map((item) => ({
          ...item,
          imageFile: null,
          imagePreview: null,
          serviceId,
        }));

        setTotal(data.total_ServiceCitiesImage || 0);

        if (addAfterLoadRef.current) {
          addAfterLoadRef.current = false;
          setContentList([...enriched, makeNewBlock(serviceId)]);
          setExpandedIndex(enriched.length);
        } else {
          setContentList(enriched);
          setExpandedIndex(null);
        }

        return enriched;
      }),
    [dispatch, serviceId]
  );

  useEffect(() => {
    setPage(1);
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId) return;
    loadPage(page);
  }, [loadPage, page, serviceId]);

  const unsavedCount = contentList.filter((item) => !item._id).length;
  const displayTotal = total + unsavedCount;
  const startIndex = (page - 1) * PER_PAGE;

  const handlePageChange = (nextPage) => {
    if (nextPage === page) return;
    setPage(nextPage);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChange = (index, field, value) => {
    const updated = [...contentList];
    updated[index][field] = value;
    setContentList(updated);
  };

  const handleImageChange = (index, file) => {
    const updated = [...contentList];
    updated[index].imageFile = file;
    updated[index].imagePreview = URL.createObjectURL(file);
    setContentList(updated);
  };

  const handleSave = async (item, index) => {
    const formData = new FormData();
    formData.append("title", item.title);
    formData.append("content", item.content);
    formData.append("serviceId", item.serviceId);
    if (item.imageFile) {
      formData.append("image", item.imageFile);
    }

    const isNew = !item._id;

    const action = isNew
      ? addServiceCityImage(formData)
      : updateServiceCityImage({ id: item._id, formData });

    const res = await dispatch(action);
    const { payload } = res || {};

    if (payload?.code === 1) {
      toast.success(isNew ? "Added successfully" : "Updated successfully");

      if (isNew) {
        // The total changed, so pull the page back from the server.
        loadPage(page);
        return;
      }

      const updated = [...contentList];
      updated[index].image = payload?.data?.image || updated[index].image;
      updated[index].imageFile = null;
      updated[index].imagePreview = null;
      setContentList(updated);
    } else {
      toast.error(payload?.message || "Failed to save content");
    }
  };

  const handleDelete = async (item, index) => {
    if (!item._id) {
      const updated = contentList.filter((_, i) => i !== index);
      setContentList(updated);
      setExpandedIndex(null);
      toast.info("Unsaved content removed");
      return;
    }

    const confirm = window.confirm(
      "Are you sure you want to delete this content?"
    );
    if (!confirm) return;

    const response = await dispatch(
      deleteServiceCityImage({ id: item._id, filters: { serviceId } })
    );
    const { payload } = response || {};

    if (payload?.code === 1) {
      toast.success("Deleted successfully");
      // The server list shifted, so reload rather than splicing locally. If
      // that emptied the last page, step back one.
      const remaining = total - 1;
      const lastPage = Math.max(1, Math.ceil(remaining / PER_PAGE));
      if (page > lastPage) {
        setPage(lastPage);
      } else {
        loadPage(page);
      }
    } else {
      toast.error(payload?.message || "Failed to delete content");
    }
  };

  const handleAddNew = () => {
    // A new block will be stored at the end of the list, so show it there.
    const lastPage = Math.max(1, Math.ceil(displayTotal / PER_PAGE));

    if (lastPage !== page) {
      addAfterLoadRef.current = true;
      setPage(lastPage);
      return;
    }

    const updated = [...contentList, makeNewBlock(serviceId)];
    setContentList(updated);
    setExpandedIndex(updated.length - 1);
  };

  return (
    <article className="col-lg-9">
      <div className="article-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-0">Service City Content</h3>
            {displayTotal > 0 && (
              <small className="text-muted">
                Showing {startIndex + 1}-{startIndex + contentList.length} of{" "}
                {displayTotal}
              </small>
            )}
          </div>
          <button className="btn btn-outline-success" onClick={handleAddNew}>
            + Add New
          </button>
        </div>

        <div ref={listRef} />

        {contentList.map((item, index) => (
          <div key={item._id || `new-${index}`} className="card mb-3">
            <div
              className="card-header d-flex justify-content-between"
              onClick={() =>
                setExpandedIndex(index === expandedIndex ? null : index)
              }
              style={{ cursor: "pointer" }}
            >
              <strong>
                {item.title || `Content ${startIndex + index + 1}`}
              </strong>
              <span>{expandedIndex === index ? "▲" : "▼"}</span>
            </div>

            {expandedIndex === index && (
              <div className="card-body">
                <input
                  className="form-control mb-3"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                />
                <ReactQuill
                  theme="snow"
                  value={item.content}
                  onChange={(val) => handleChange(index, "content", val)}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mt-3"
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                />
                {item.imagePreview || item.image ? (
                  <img
                    src={item.imagePreview || item.image}
                    alt="Preview"
                    className="mt-2"
                    style={{ maxWidth: "150px" }}
                  />
                ) : (
                  <p className="text-muted mt-2">No image uploaded</p>
                )}

                <div className="text-end mt-3 d-flex gap-2 justify-content-end">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item, index)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSave(item, index)}
                  >
                    {item._id ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {displayTotal === 0 && (
          <p className="text-muted text-center my-4">No content added yet.</p>
        )}

        {total > PER_PAGE && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              activePage={page}
              itemsCountPerPage={PER_PAGE}
              totalItemsCount={total}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default ServiceCityContentManager;
