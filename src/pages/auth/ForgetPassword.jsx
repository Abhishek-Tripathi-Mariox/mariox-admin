import FormInputText from "../../components/FormInputText";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postRawData } from "../../services/httphandler";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("*Invalid email").required("*Email is Required"),
  });

  const { values, handleSubmit, touched, errors, handleChange } = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async ({ email }) => {
      let response = await postRawData("admin/forgotPassword", { email });
      if (response && response?.code === 1) {
        navigate(`/auth/otp-input?email=${email}`);
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
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
          <div className="col-sm-7 col-md-7 col-lg-6 mr-0 pr-0">
            <div className="form-bg">
              <form onSubmit={handleSubmit} className="form-style">
                <div className="row">
                  <div className="col-sm-12 col-md-12 text-center mb-4">
                    <img
                      alt=""
                      src="assets/images/forgot-password.png"
                      className="img-fluid"
                    />
                    <h2 className="mdl-ttl">Forgot Password</h2>
                    <p className="mdl-sbttl">
                      Please enter your email address in order to retrieve your
                      password
                    </p>
                  </div>
                  <div className="col-sm-12 col-md-12 mb-4">
                    <FormInputText
                      onChange={handleChange}
                      name="email"
                      value={values.email}
                      placeholder="Email Address"
                    />
                    <span className="errorMessage">
                      {touched["email"] && errors["email"]}
                    </span>
                  </div>
                  <div className="col-sm-12 col-md-12 text-center">
                    <button type="submit" className="btn btn-save w-100">
                      Submit
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

export default ForgotPassword;
