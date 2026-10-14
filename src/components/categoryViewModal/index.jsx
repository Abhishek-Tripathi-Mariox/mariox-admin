import { Modal } from "reactstrap";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { categoryDetails } from "../../pages/admin/ManageCategory/categorySlice";

const CategoryViewModal = ({ id }) => {
  const [modal, setModal] = React.useState(false);
  const dispatch = useDispatch();
  const [state, setstate] = useState({
    id: "",
    image: "",
    category_name: "",
    subCategory: [],
  });

  useEffect(() => {
    dispatch(categoryDetails({ id })).then((data) => {
      setstate({
        id: data?.payload._id,
        image: data?.payload.image,
        category_name: data?.payload.categoryName,
        subCategory: data?.payload?.subCategory || [],
      });
    });
  }, [dispatch, id]);

  // Toggle for Modal
  const toggle = () => setModal(!modal);
  return (
    <>
      <button className="btn" onClick={toggle}>
        <img alt="" src="assets/images/view.png" />
      </button>
      <Modal isOpen={modal} toggle={toggle}>
        <div className="modal-content">
          <div className="modal-body text-capitalize">
            <button
              onClick={toggle}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div className="text-center mt-2">
              <img alt="" src="assets/images/small-cate.png" />
              {/* <p class="mb-0">{state.category_name}</p> */}
              <h5>{state.category_name}</h5>
              <div className="cate-img">
                <img
                  alt=""
                  src={
                    state.image?.includes("http")
                      ? state.image
                      : "assets/images/employe.png"
                  }
                  className="img-fluid"
                />
              </div>
            </div>
            <hr />
            <div className="modal-dec">
              <img
                alt=""
                src="assets/images/small-cate.png"
                className="modal-dec-img"
              />
              <h5>Sub-Category</h5>
              <div
                className={
                  state?.subCategory?.length > 0 ? "modal-sub-cate" : ""
                }
              >
                {(state?.subCategory &&
                  state?.subCategory?.length > 0 &&
                  state?.subCategory?.map((data) => {
                    return (
                      <div key={data?.id}>
                        <div
                          style={{
                            height: "80px",
                            width: "80px",
                            margin: "0 auto",
                            borderRadius: "10px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            alt=""
                            className="object-fit-cover"
                            src={
                              data?.image?.includes("http")
                                ? data?.image
                                : "assets/images/employe.png"
                            }
                          />
                        </div>
                        <p>{data?.subCategoryName}</p>
                      </div>
                    );
                  })) || <div>No Data Found</div>}
                {/* <div>
                                    <img alt="" src="assets/images/employe.png" />
                                    <p>glasses 1</p>
                                </div>
                                <div>
                                    <img alt="" src="assets/images/employe.png" />
                                    <p>glasses 2</p>
                                </div>
                                <div>
                                    <img alt="" src="assets/images/employe.png" />
                                    <p>glasses 3</p>
                                </div>
                                <div>
                                    <img alt="" src="assets/images/employe.png" />
                                    <p>glasses 4</p>
                                </div> */}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CategoryViewModal;
