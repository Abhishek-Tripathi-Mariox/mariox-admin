import { Modal } from "reactstrap";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { subCategoryDetails } from "../../pages/admin/ManageCategory/subCategorySlice";

const SubCategoryViewModal = ({ id }) => {
  const [modal, setModal] = React.useState(false);
  const dispatch = useDispatch();
  const [state, setstate] = useState({
    id: "",
    image: "",
    sub_category: "",
    category: {},
  });

  useEffect(() => {
    if (modal) {
      dispatch(subCategoryDetails({ id })).then((data) => {
        console.log(data, "Sub cate details");
        setstate({
          id: data.payload._id,
          image: data.payload.image,
          sub_category: data.payload.subCategoryName,
          category: data.payload.category || {},
        });
      });
    }
  }, [dispatch, id, modal]);

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
              <p className="mb-0">Sub-Category</p>
              <h5>{state.sub_category}</h5>
              <div className="sub-cate-img">
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
            <div className="text-center mt-2">
              <img alt="" src="assets/images/small-cate.png" />
              <p className="mb-0">Category</p>
              <h5>{state.category && state.category?.categoryName}</h5>
              <div className="cate-img">
                <img
                  alt=""
                  src={
                    state.category.image?.includes("http")
                      ? state.category.image
                      : "assets/images/employe.png"
                  }
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SubCategoryViewModal;
