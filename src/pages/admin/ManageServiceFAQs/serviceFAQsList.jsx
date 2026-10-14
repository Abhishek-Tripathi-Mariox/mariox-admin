import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../../../components/deleteModal";
import {
  serviceFAQsList,
  deleteServiceFAQs,
  toggleServiceFAQs,
} from "./serviceFAQSlice";

const ServiceFAQList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [id, setDeleteId] = useState("");

  const filter = useSelector((state) => state.serviceFAQ.filters);
  const data = useSelector((state) => state.serviceFAQ?.serviceFAQsList);
  const total = useSelector((state) => state.serviceFAQ?.total);

  const [filters, setFilters] = useState(filter);

  useEffect(() => {
    if (filter) setFilters(filter);
  }, [filter]);

  const getFAQListing = useCallback(() => {
    dispatch(serviceFAQsList(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    getFAQListing();
  }, [getFAQListing]);

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleSearch = debounce((e) => {
    setFilters({ ...filters, page: 1, search: e.target.value });
  }, 300);

  const toggle = () => setModal(!modal);

  const deleteHandler = () => {
    dispatch(deleteServiceFAQs({ filters, id })).then((res) => {
      if (res?.payload?.code === 1) {
        toggle();
        toast.success("FAQ deleted successfully");
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const toggleTab = (isActive) => {
    setFilters({ ...filters, isActive, page: 1 });
  };

  const handleToggle = (id) => {
    dispatch(toggleServiceFAQs({ filters, id })).then((res) => {
      const { code, message } = res.payload;
      toast[code === 1 ? "success" : "error"](message);
    });
  };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3">
            <div className="link-active">
              <img src="assets/images/Users-selected.png" alt="" />
              <span>
                <p>{total || 0}</p>
                <p>Total Service FAQs</p>
              </span>
            </div>
          </div>
          <div className="col-md-6 mb-3 d-flex justify-content-end">
            <form className="has-search mr-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search FAQ by Question"
                onChange={handleSearch}
              />
            </form>
            <Link to="/admin/manage-service-faqs/add" className="add-new">
              + Add New
            </Link>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            <ul className="nav nav-tabs group-nav">
              <li className="nav-item">
                <Link
                  className={`nav-link ${filters.isActive ? "active" : ""}`}
                  to="#"
                  onClick={() => toggleTab(true)}
                >
                  Active
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${!filters.isActive ? "active" : ""}`}
                  to="#"
                  onClick={() => toggleTab(false)}
                >
                  Inactive
                </Link>
              </li>
            </ul>

            <div className="d-flex justify-content-end align-items-center my-3">
              {/* <DateFilterModal dateHandler={dateHandler} /> */}
            </div>

            <div className="table-responsive">
              <table className="table text-center">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.length > 0 ? (
                    data.map((faq) => (
                      <tr key={faq._id}>
                        <td>{faq.question}</td>
                        <td>{faq.answer}</td>
                        <td>
                          <button className="btn">
                            <input
                              checked={faq.status}
                              onChange={() => handleToggle(faq._id)}
                              type="checkbox"
                              className="toggle"
                            />
                          </button>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/manage-service-faqs/details/${faq._id}`
                                )
                              }
                              className="btn"
                            >
                              <img src="assets/images/view.png" alt="" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/manage-service-faqs/edit/${faq._id}`
                                )
                              }
                              className="btn"
                            >
                              <img src="assets/images/edit.png" alt="" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(faq._id);
                                toggle();
                              }}
                              className="btn"
                            >
                              <img src="assets/images/delete.png" alt="" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>No FAQs found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {total > filters.limit && (
              <Pagination
                activePage={filters.page}
                itemsCountPerPage={filters.limit}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
              />
            )}

            <DeleteModal
              deleteCategory={deleteHandler}
              modal={modal}
              toggle={toggle}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceFAQList;
