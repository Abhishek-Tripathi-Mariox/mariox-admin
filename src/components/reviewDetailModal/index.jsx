import React from "react";
import ReactStars from "react-rating-stars-component";
import { Modal } from "reactstrap";
import Upload from "../uploadFile/index.jsx";

const ReviewDetailModal = ({ data }) => {
  const [modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);

  return (
    <>
      <img
        alt=""
        src="assets/images/view.png"
        onClick={toggle}
        className="cursor-pointer"
      />
      <Modal className="modal-md" isOpen={modal} toggle={toggle}>
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
            <div className="reviews-rating-form">
              <div className="col-sm-12 col-md-12 col-lg-12 text-center mt-4">
                <Upload
                  multipleImager={data?.images?.map((it) => it?.image)}
                  multiple={true}
                  disabled={true}
                />
              </div>
              <div className="rating-star">
                <p>Click on star to review</p>
                <ul id="stars" className="stars">
                  <ReactStars
                    count={5}
                    // onChange={ratingChanged}
                    size={24}
                    value={data.rating}
                    edit={false}
                    activeColor="#ffd700"
                  />
                </ul>
              </div>
              <div className="form mt-2 mb-3">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  className="form-control"
                  value={data.name}
                  disabled={true}
                />
              </div>

              <div className="rating-form">
                <form action="#">
                  <div className="single-form form-default">
                    <label>Write your Review</label>
                    <div className="form-input">
                      <textarea
                        placeholder="Your review here"
                        name="review"
                        // onChange={handleChange}
                        value={data.review}
                        disabled={true}
                      ></textarea>
                      <i className="fa fa-message-text-outline"></i>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReviewDetailModal;
