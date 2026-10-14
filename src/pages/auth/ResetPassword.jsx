import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormInputPassword from "../../components/FormInputPassword";
import { patchRawData } from "../../services/httphandler";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let token = searchParams.get("t_k");

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Too Short!")
      .max(50, "Too Long!")
      .required("*Password Is Required"),
    newpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "*Passwords must match")
      .required("*Password Is Required"),
  });

  const { values, handleSubmit, touched, errors, handleChange } = useFormik({
    initialValues: {
      password: "",
      newpassword: "",
    },
    validationSchema,
    onSubmit: async ({ password, newpassword }) => {
      let formdata = new FormData();
      formdata.append("newPassword", password);
      formdata.append("confirmPassword", newpassword);

      let response = patchRawData(
        "admin/resetPassword",
        { newPassword: password, confirmPassword: newpassword },
        { token }
      );
      response.then((data) => {
        if (data && data?.code === 1) {
          toast.success(data?.message);
          navigate(`/auth/`, { replace: true });
        } else {
          toast.error(data?.message);
        }
      });
    },
  });

  return (
    <section className="">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-sm-5 col-md-5 col-lg-6 text-center">
            <div className="logo-bg">
              <div className="mb-5">
                <img
                  src="assets/images/favicon.ico"
                  className="img-fluid"
                  alt="logo"
                />
              </div>
              <div className="mt-2">
                <img
                  src="assets/images/activity.png"
                  className="img-fluid"
                  alt="logo"
                />
              </div>
            </div>
          </div>
          <div className="col-sm-7 col-md-7 col-lg-6 mr-0 pr-0">
            <div className="form-bg">
              <form onSubmit={handleSubmit} className="form-style">
                <div className="row">
                  <div className="col-sm-12 col-md-12 text-center mb-4">
                    <img
                      alt=""
                      src="assets/images/reset.png"
                      className="img-fluid"
                    />
                    <h2 className="mdl-ttl">Reset Password</h2>
                    <p className="mdl-sbttl">Please reset your password</p>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                    <FormInputPassword
                      placeholder="Enter New Password"
                      onChange={handleChange}
                      name="password"
                      value={values.password}
                    />
                    <span className="errorMessage">
                      {touched["password"] && errors["password"]}
                    </span>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                    <FormInputPassword
                      placeholder="Enter confirm new password"
                      onChange={handleChange}
                      name="newpassword"
                      value={values.newpassword}
                      label="Confirm Password"
                    />
                    <span className="errorMessage">
                      {touched["newpassword"] && errors["newpassword"]}
                    </span>
                  </div>
                  <div className="col-sm-12 col-md-12 text-center">
                    <button type="submit" className="btn btn-save w-100">
                      Done
                    </button>
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

export default ResetPassword;
