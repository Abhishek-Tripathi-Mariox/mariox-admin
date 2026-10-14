import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  fetchServiceContentByServiceId,
  updateServiceImage,
  addServiceImage,
  deleteServiceImage,
} from "./serviceContentSlice";

const PER_PAGE = 10;

const makeNewBlock = (serviceId) => ({
  title: "",
  content: "",
  image: "",
  imageFile: null,
  imagePreview: null,
  serviceId,
});

const ServiceContentEditor = () => {
  const { serviceId } = useParams();
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
        fetchServiceContentByServiceId({
          serviceId,
          page: pageNo,
          limit: PER_PAGE,
        })
      ).then((res) => {
        const data = res?.payload || {};
        const enriched = (data.ServiceImage || []).map((item) => ({
          ...item,
          imageFile: null,
          imagePreview: null,
          serviceId,
        }));

        setTotal(data.total_ServiceImage || 0);

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
    loadPage(page);
  }, [loadPage, page]);

  const unsavedCount = contentList.filter((item) => !item._id).length;
  const displayTotal = total + unsavedCount;
  const startIndex = (page - 1) * PER_PAGE;

  const handlePageChange = (nextPage) => {
    if (nextPage === page) return;
    setPage(nextPage);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle input and content changes
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

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const handleDelete = async (item, index) => {
    if (!item._id) {
      // If item is not saved in DB yet, just remove from UI
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
      deleteServiceImage({ id: item._id, filters: { serviceId } })
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

  const handleSaveSingle = async (item, index) => {
    const formData = new FormData();
    formData.append("title", item.title);
    formData.append("content", item.content);
    formData.append("serviceId", item.serviceId);
    if (item.imageFile) {
      formData.append("image", item.imageFile);
    }

    const isNew = !item._id;

    try {
      const action = isNew
        ? addServiceImage(formData)
        : updateServiceImage({ id: item._id, formData });

      const response = await dispatch(action);
      const { payload } = response || {};

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
        toast.error(payload?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Error while saving");
    }
  };

  return (
    <article className="col-lg-9">
      <div className="article-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-0">Manage Service Content</h3>
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
              className="card-header d-flex justify-content-between align-items-center"
              onClick={() => toggleExpand(index)}
              style={{ cursor: "pointer" }}
            >
              <strong>
                {item.title || `Content ${startIndex + index + 1}`}
              </strong>
              <span>{expandedIndex === index ? "▲" : "▼"}</span>
            </div>

            {expandedIndex === index && (
              <div className="card-body">
                <div className="mb-3">
                  <label>Title</label>
                  <input
                    className="form-control"
                    value={item.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>Content</label>
                  <ReactQuill
                    theme="snow"
                    value={item.content}
                    onChange={(val) => handleChange(index, "content", val)}
                  />
                </div>

                <div className="mb-3">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                  />
                  {item.imagePreview ? (
                    <img
                      src={item.imagePreview}
                      alt="Preview"
                      style={{ maxWidth: "120px", marginTop: "10px" }}
                    />
                  ) : item.image ? (
                    <img
                      src={item.image}
                      alt="Uploaded"
                      style={{ maxWidth: "120px", marginTop: "10px" }}
                    />
                  ) : (
                    <p className="text-muted mt-2">No image uploaded</p>
                  )}
                </div>

                <div className="text-end d-flex gap-2 justify-content-end">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item, index)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSaveSingle(item, index)}
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

export default ServiceContentEditor;
