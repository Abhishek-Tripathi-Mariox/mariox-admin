import { Modal } from "reactstrap";
import { useState } from "react";
import { toast } from "react-toastify";

const DateFilterModal = ({ dateHandler }) => {
  const [modal, setModal] = useState(false);
  const [state, setstate] = useState({
    startDate: "",
    endDate: "",
  });
  const toggle = () => setModal(!modal);

  const handleDates = (e) => {
    e.preventDefault();
    const { startDate, endDate } = state;
    if (startDate && endDate) {
      dateHandler({ startDate, endDate });
      toggle();
    } else toast.error("*Please fill both date fields.");
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setstate({
      ...state,
      [name]: value,
    });
  };

  return (
    <>
      <span className="date-filter" title="Date" onClick={toggle}>
        <i className="fa fa-filter" aria-hidden="true"></i>
      </span>
      <Modal isOpen={modal} toggle={toggle}>
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
          <form className="form-style">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 text-center mb-4">
                <h4>Select Date</h4>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6">
                <div className="form-group">
                  <label>From</label>
                  <div className="input-container">
                    <input
                      type="date"
                      name="startDate"
                      className="form-control pl-5"
                      placeholder="11/01/2021"
                      value={state.startDate}
                      onChange={handleChange}
                    />
                    <i
                      className="fa fa-calendar input-img"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6">
                <div className="form-group">
                  <label>To</label>
                  <div className="input-container">
                    <input
                      type="date"
                      className="form-control pl-5"
                      placeholder="15/03/2021"
                      name="endDate"
                      min={state.startDate}
                      value={state.endDate}
                      onChange={handleChange}
                    />
                    <i
                      className="fa fa-calendar input-img"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                <div className="text-center">
                  <button onClick={handleDates} className="btn btn-save">
                    Done
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default DateFilterModal;
