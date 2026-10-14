import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { postFormData, putRawData } from "../../services/httphandler";
const OTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let email = searchParams.get("email");
  console.log(email, "Email");
  const [params, setParams] = useState({
    id: "",
    otp: "",
  });
  const [time, setTime] = useState(5);

  useEffect(() => {
    if (time > 0) {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
  }, [time]);

  const handleResendOtp = (e) => {
    e.preventDefault();
    let response = putRawData("admin/resendOtp", JSON.stringify({ email }));
    response.then((data) => {
      console.log(data, "data");
      if (data && data?.code === 1) {
        setTime(5);
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    });
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("email", email);
    formdata.append("otp", params.otp);
    let response = postFormData("admin/verifyOtp", formdata);
    response.then((data) => {
      console.log(data, "data");
      if (data && data?.code === 1) {
        toast.success(data?.message);

        navigate(`/auth/reset-password?t_k=${data?.data?.token}`);
      } else {
        toast.error(data?.message);
      }
    });
  };

  return (
    <section className="">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-sm-12 col-md-12 col-lg-6 text-center">
            <div className="logo-bg">
              <div className="mb-5">
                <img
                  src="assets/images/favicon.ico"
                  className="img-fluid logo-admin"
                  alt="logo"
                />
              </div>
              <div className="mt-2">
                <img
                  src="assets/images/activity.png"
                  className="img-fluid lft-img"
                  alt="logo"
                />
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-12 col-lg-6 mr-0 pr-0">
            <div className="form-bg">
              <form onSubmit={submitOtp} className="row form-style">
                <div className="col-sm-12 text-center">
                  <img
                    alt=""
                    src="assets/images/otp.png"
                    className="img-fluid"
                  />
                  <h2 className="mdl-ttl">OTP Verification</h2>
                  <p className="mdl-sbttl">
                    We have send OTP on your email address
                  </p>
                </div>
                <div
                  className="opt_time mb-3 display-block text-center"
                  style={{ width: "100%" }}
                >
                  <span className="o_timing">00: {time}</span>
                </div>
                <div className="form-group col-sm-12">
                  <div className="passcode-wrapper">
                    <OtpInput
                      containerStyle={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        width: "100%",
                      }}
                      inputStyle="otpInputBox"
                      value={params.otp}
                      onChange={(otp) =>
                        setParams({
                          ...params,
                          otp,
                        })
                      }
                      numInputs={4}
                      renderInput={(props) => (
                        <input {...props} className="otpInputBox" />
                      )}
                    />
                  </div>
                </div>

                <div className="col-sm-12 mt-4">
                  <button type="submit" className="btn btn-save w-100">
                    Submit
                  </button>
                </div>
                <div className="col-sm-12 text-center mt-4">
                  <div>
                    Didn&apos;t get OTP?{" "}
                    <Link
                      to="#"
                      className="forgot-pass p-0"
                      style={{
                        color: "#b4195b",
                        cursor: `${time > 0 ? "no-drop" : "pointer"}`,
                      }}
                      onClick={
                        time === 0
                          ? handleResendOtp
                          : () => {
                              return false;
                            }
                      }
                    >
                      {" "}
                      Resend
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OTP;
