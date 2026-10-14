import { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../../../components/deleteModal";
import { deleteFaqs, faq, getFaqs, totalFaq } from "./faqSlice";
import { patchEncodedInUrl } from "../../../services/httphandler";

const FaqList = () => {
  const dispatch = useDispatch();
  const History = useNavigate();
  const [modal, setModal] = useState(false);
  const [id, setDeleteId] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    isActive: true,
    search: "",
  });

  const data = useSelector(faq);
  const total = useSelector(totalFaq);
  console.log(data, "data");

  useEffect(() => {
    dispatch(getFaqs(filters));
  }, [dispatch, filters]);

  const handlePageChange = (pageNumber) => {
    setFilters({
      ...filters,
      page: pageNumber,
    });
  };

  // const handleChange = ({ name, e }) => {
  //     setFilters({
  //         ...filters,
  //         [name]: e.target.value
  //     })
  // }

  const toggle = () => {
    setModal(!modal);
  };

  const deleteCat = () => {
    dispatch(deleteFaqs({ filters, id })).then((data) => {
      if (data?.payload?.code === 1) {
        toggle();
        toast.success("Success");
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  const handleToggle = (id) => {
    patchEncodedInUrl("admin/faqs", { id: id }).then((data) => {
      if (data?.code === 1) {
        dispatch(getFaqs(filters));
        toast.success("Success");
      } else {
        toast.error(data?.message);
      }
    });
  };
  const toggleTab = (val) => {
    setFilters({
      ...filters,
      isActive: val,
    });
  };
  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center col-rever">
          <div className="col-sm-12 col-md-6 col-lg-6 mb-3">
            <div className="link-active">
              <img src="assets/images/Users-selected.png" alt="" />
              <span>
                <p>{total && total}</p>
                <p>Total Faqs</p>
              </span>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 mb-3">
            <div className="d-flex align-items-center lg-justify-content-end">
              {/* <form class="has-search">
                                <span class="form-search-icon form-control-feedback"></span>
                                <input type="search" class="form-control" placeholder="Search faqs by name"
                                    onChange={(e) => handleChange({
                                        name: 'search',
                                        e
                                    })} />
                            </form> */}
              <Link to="/admin/faqs/add" class="add-new">
                + Add New
              </Link>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-5 mb-3">
            <ul className="nav nav-tabs group-nav" role="tablist">
              <li className="nav-item">
                <Link
                  className={`nav-link ` + (filters.isActive ? "active" : "")}
                  onClick={() => toggleTab(true)}
                  data-toggle="tab"
                  to="#"
                >
                  active
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ` + (filters.isActive ? "" : "active")}
                  onClick={() => toggleTab(false)}
                  data-toggle="tab"
                  to="#"
                >
                  inactive
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-sm-12">
            <div className="tab-content mt-4">
              <div id="inactive-product" className="tab-pane active">
                <div className="table-responsive text-center">
                  <table className="table storetable">
                    <thead className="text-center">
                      <tr>
                        <th scope="col">Sr. No.</th>
                        <th scope="col">Question</th>
                        <th scope="col">Answer</th>
                        <th scope="col">action</th>
                      </tr>
                      <tr className="border-0 bg-none invisible">
                        <td className="border-0 bg-none"></td>
                      </tr>
                    </thead>
                    <tbody>
                      {data && data.length > 0 ? (
                        data.map((dataElem, index) => {
                          return (
                            <tr key={dataElem.id}>
                              <td>{index + 1}</td>
                              <td>{dataElem.question}</td>
                              <td>{dataElem.answer}</td>

                              <td>
                                <div className="d-flex justify-content-center action">
                                  <button
                                    onClick={() =>
                                      History(
                                        `/admin/faqs/edit/${dataElem._id}`
                                      )
                                    }
                                    className="btn"
                                  >
                                    <img alt="" src="assets/images/edit.png" />
                                  </button>
                                  <button className="btn">
                                    <input
                                      checked={filters.isActive}
                                      onChange={() =>
                                        handleToggle(dataElem._id)
                                      }
                                      type="checkbox"
                                      id={dataElem._id}
                                      className="toggle"
                                      alt=""
                                    />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setDeleteId(dataElem._id);
                                      toggle();
                                    }}
                                    className="btn"
                                  >
                                    <img
                                      src="assets/images/delete.png"
                                      alt=""
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7}>No Data Found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {total && total > 10 ? (
          <div>
            <Pagination
              activePage={filters.page}
              itemsCountPerPage={filters.limit}
              totalItemsCount={total}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <DeleteModal deleteCategory={deleteCat} modal={modal} toggle={toggle} />
    </article>
  );
};
export default FaqList;
