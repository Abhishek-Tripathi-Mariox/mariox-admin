import { Modal } from "reactstrap";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ReactStars from "react-rating-stars-component";
import Upload from "../uploadFile/index.jsx";

const ReviewModal = ({ handleUpload }) => {
  const [modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);

  const [reviews, setreviews] = useState({
    rating: "",
    review: "",
    images: "",
    name: "",
  });

  const ratingChanged = (newRating) => {
    setreviews({
      ...reviews,
      rating: newRating,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setreviews({
      ...reviews,
      [name]: value,
    });
  };

  const dataHandler = (data) => {
    setreviews({
      ...reviews,
      images: data,
    });
  };

  const handleSubmit = () => {
    const { rating, review, name, images } = reviews;
    console.log(reviews, "Revieews");
    if (rating && review && name && images) {
      handleUpload(reviews);
      toggle();

      setreviews({
        rating: "",
        review: "",
        images: "",
        name: "",
      });
    } else {
      let errors = "";
      for (const key in reviews) {
        if (Object.hasOwnProperty.call(reviews, key)) {
          const element = reviews[key];
          if (!element) {
            errors = `Kindly add ${key}`;
            break;
          }
        }
      }
      toast.error(errors);
    }
  };
  return (
    <>
      <button
        style={{ fontSize: "14px", border: "none" }}
        onClick={toggle}
        type="button"
        className="add-new"
      >
        Add Review
      </button>
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
                <Upload dataHandler={dataHandler} multiple={true} />
              </div>
              <div className="rating-star">
                <p>Click on star to review</p>
                <ul id="stars" className="stars">
                  <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    value={reviews.rating}
                    edit={true}
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
                  value={reviews.name}
                  onChange={(e) => {
                    setreviews({
                      ...reviews,
                      name: e.target.value,
                    });
                  }}
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
                        onChange={handleChange}
                        value={reviews.review}
                      ></textarea>
                      <i className="fa fa-message-text-outline"></i>
                    </div>
                  </div>
                  <div className="single-rating-form flex-wrap">
                    <div className="rating-form-btn">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="add-new"
                      >
                        Write a Review
                      </button>
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

export default ReviewModal;
