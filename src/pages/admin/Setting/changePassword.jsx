import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormInputPassword from "../../../components/FormInputPassword";
import Loader from "../../../components/loader";
import { patchRawData } from "../../../services/httphandler";
import { useState } from "react";

const ChangePassword = () => {
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .min(8, "*Min is 8")
      .required("*Current Password is Required."),
    newPassword: Yup.string()
      .min(8, "*Min is 8")
      .required("*New Password is Required."),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("newPassword"), null],
        "*New Password & Confirm New Password must match."
      )
      .required("*Confirm New Password Required."),
  });

  const { values, handleSubmit, touched, errors, handleChange } = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async () => {
      setIsLoading(true);
      let response = await patchRawData("admin/changePassword", values);

      console.log(response, "response change password");
      if (response && response.code === 1) {
        setIsLoading(false);

        toast.success(response.message);
        history("/admin/");
      } else {
        setIsLoading(false);

        toast.error("Something went wrong.");
      }
    },
  });

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center col-rever">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h2 className="head-title">Change Password</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit} className="form-style chng-pass">
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 text-center mb-3">
                  <img
                    src="assets/images/reset.png"
                    className="img-fluid"
                    alt=""
                  />
                  <p>Please Change Password your password</p>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                  <FormInputPassword
                    placeholder="Enter Current Password"
                    image="password.png"
                    onChange={handleChange}
                    name="currentPassword"
                    type="text"
                    value={values.currentPassword}
                    title="Current Password"
                  />

                  <span className="errorMessage">
                    {touched["currentPassword"] && errors["currentPassword"]}
                  </span>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                  <FormInputPassword
                    placeholder="Enter New Password"
                    image="password.png"
                    onChange={handleChange}
                    name="newPassword"
                    type="text"
                    value={values.newPassword}
                    title="New Password"
                  />

                  <span className="errorMessage">
                    {touched["newPassword"] && errors["newPassword"]}
                  </span>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                  <FormInputPassword
                    placeholder="Enter Confirm New Password"
                    image="password.png"
                    onChange={handleChange}
                    name="confirmPassword"
                    type="text"
                    value={values.confirmPassword}
                    title="Confirm Password"
                  />

                  <span className="errorMessage">
                    {touched["confirmPassword"] && errors["confirmPassword"]}
                  </span>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-save"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader /> : "Done"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ChangePassword;
