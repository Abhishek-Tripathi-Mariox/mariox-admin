import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "reactstrap";
// import { groupList } from "../../views/folder/ManageGroup/groupSlice.js";

const SelectBoxModal = ({ handleUpload, group = false }) => {
  const [modal, setModal] = React.useState(false);
  const dispatch = useDispatch();
  const [count, setCount] = React.useState(1);
  const [labeloptions, setLabeloptions] = React.useState([]);
  const [option, setoption] = React.useState([
    {
      value: "",
    },
  ]);
  const toggle = () => setModal(!modal);
  const [params, setparams] = useState({
    label: "",
  });

  useEffect(() => {
    // dispatch(
    //   groupList({
    //     limit: 10000,
    //     page: 1,
    //   })
    // ).then((data) => {
    //   setLabeloptions(data.payload.labelGroups.data);
    //   // console.log(data)
    // });
  }, []);

  const handleChange = (e, i) => {
    const { value } = e.target;
    const options = option;
    options[i] = {
      value,
    };

    setoption([...options]);
  };

  const handleSelect = (e) => {
    // console.log(e.target.value)
    labeloptions.filter((data) => {
      // console.log(data.id, e.target.value, 'compari')
      if (data.id.toString() === e.target.value) {
        setCount(data.options.length + option.length);
        setoption([...option, ...data.options]);
      }
    });
  };

  console.log(option, "option");
  const HandleUI = useCallback(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(
        <input
          value={option[i]?.value || ""}
          onChange={(e) => handleChange(e, i)}
          className="form-control my-1"
          placeholder="Attachment values"
        />
      );
    }
    return arr;
  }, [count, modal]);

  const handleSubmit = () => {
    const { label } = params;
    if (label && option.length) {
      handleUpload({ ...params, option });
      setparams({
        label: "",
      });
      setoption([
        {
          value: "",
        },
      ]);
      setCount(1);

      toggle();
    } else {
      toast.error("*Please fill the form first.");
    }
  };

  // console.log(labeloptions)
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
              onClick={toggle}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <form className="form-style">
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 text-center mb-4">
                  <h4>SelectBox Label</h4>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Enter Label</label>
                    <div className="input-container">
                      <input
                        type="text"
                        onChange={(e) =>
                          setparams({
                            ...params,
                            label: e.target.value,
                          })
                        }
                        value={params.label}
                        className="form-control pl-5"
                        placeholder="Enter Label"
                      />
                      <img
                        alt=""
                        src="assets/images/product.png"
                        className="input-img"
                      />
                    </div>
                  </div>
                </div>
                {group && (
                  <div className="col-sm-12 mb-3">
                    <label style={{ fontWeight: "bold", margin: "10px 0px" }}>
                      Select From Group
                    </label>
                    <select onChange={handleSelect} className="form-control">
                      <option value="">Select Group</option>
                      {labeloptions &&
                        labeloptions.length > 0 &&
                        labeloptions.map((data) => {
                          return (
                            <option key={data.id} value={data.id}>
                              {data.label}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                )}

                <div className="col-sm-12">
                  {/* <div class="form-group"> */}
                  <div>
                    <label style={{ fontWeight: "bold", margin: "10px 0px" }}>
                      SelectBox Items
                    </label>
                    <span
                      onClick={() => {
                        setoption([...option, { value: "" }]);
                        setCount(count + 1);
                      }}
                      className="add-more-type"
                      title="Add More"
                      data-toggle="modal"
                      data-target="#colorMore"
                    >
                      +
                    </span>
                  </div>

                  <HandleUI />

                  {
                    // <div>
                    //     for()
                    // </div>
                  }

                  {/* <div class="input-container">
                                            <input
                                                type="text"
                                                onChange={(e) => setparams({
                                                    ...params,
                                                    code: e.target.value
                                                })}
                                                class="form-control pl-5"
                                                placeholder="Enter Label" />
                                            <img alt="" src="assets/images/product.png" class="input-img" />
                                        </div> */}
                  {/* </div> */}
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

export default SelectBoxModal;
