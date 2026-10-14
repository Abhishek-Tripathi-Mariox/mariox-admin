import { Modal } from "reactstrap";
import React, { useState } from "react";
import Upload from "../uploadFile/index.jsx";
import { toast } from "react-toastify";

const DescriptionImageModal = ({ handleUpload }) => {
  const [modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);
  const [params, setparams] = useState({
    name: "",
    image: "",
  });

  const dataHandler = (data) => {
    setparams({
      ...params,
      image: data.location,
    });
  };

  const handleSubmit = () => {
    const { image, name } = params;
    if (name && image) {
      handleUpload(params);
      toggle();
    } else {
      toast.error("*Please fill the form first.");
    }
  };
  return (
    <>
      <span
        className="add-more-type"
        onClick={toggle}
        title="Add More"
        data-toggle="modal"
        data-target="#colorMore"
      >
        +
      </span>
      <Modal className="modal-md" isOpen={modal} toggle={toggle}>
        <div className="modal-content">
          <div className="modal-body text-capitalize">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <form className="form-style">
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 text-center mb-4">
                  <h4>Description Image</h4>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                  <Upload
                    text="image of description"
                    dataHandler={dataHandler}
                  />
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Image Name</label>
                    <div className="input-container">
                      <input
                        type="text"
                        onChange={(e) =>
                          setparams({
                            ...params,
                            name: e.target.value,
                          })
                        }
                        className="form-control pl-5"
                        placeholder="Image Name"
                      />
                      <img
                        alt=""
                        src="assets/images/product.png"
                        className="input-img"
                      />
                    </div>
                  </div>
                </div>
                {/* <div class="col-sm-6 col-md-6 col-lg-6">
                                    <div class="form-group">
                                        <label>Image</label>
                                        <div class="input-container">
                                            <input type="file" class="form-control pl-5" />
                                            <img alt="" src="assets/images/product.png" class="input-img" />
                                        </div>
                                    </div>
                                </div> */}
                <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                  <div className="text-center">
                    <button
                      onClick={handleSubmit}
                      type="button"
                      className="btn btn-save"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DescriptionImageModal;
