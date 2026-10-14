// import { useFormik } from "formik";
// import Cookies from "js-cookie";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import * as Yup from "yup";
// import FormInputPassword from "../../components/FormInputPassword";
// import FormInputText from "../../components/FormInputText";
// import { postRawData } from "../../services/httphandler";
// import Loader from "../../components/loader";
// import { useEffect, useState } from "react";

// const Login = () => {
//   useEffect(() => {
//     Cookies.remove();
//   }, []);

//   const router = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email("*Invalid email").required("*Email is Required"),
//     password: Yup.string()
//       .min(2, "Too Short!")
//       .max(50, "Too Long!")
//       .required("*Password is Required"),
//   });

//   const { values, handleSubmit, touched, errors, handleChange } = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema,
//     onSubmit: async () => {
//       setIsLoading(true);
//       let response = await postRawData("admin/login", values);

//       console.log(response, "Login response");
//       if (response && response?.code === 1) {
//         Cookies.set("t_k", response?.data?.token);
//         Cookies.set(
//           "adminData",
//           JSON.stringify({
//             name: response?.data?.admin.name,
//             role: response?.data?.admin.role,
//             permissions: response?.data?.admin.permissions,
//           })
//         );
//         router("/admin/manage-countries");
//         setIsLoading(false);
//         toast.success("Success");
//       } else {
//         toast.error(response?.message);
//         setIsLoading(false);
//       }
//     },
//   });

//   return (
//     <section className="">
//       <div className="container-fluid">
//         <div className="row align-items-center">
//           <div className="col-sm-5 col-md-5 col-lg-6 text-center">
//             <div className="logo-bg">
//               <div className="mb-5">
//                 <img
//                   src="assets/images/favicon.ico"
//                   className="img-fluid logo-admin"
//                   alt="logo"
//                 />
//               </div>
//               <div className="mt-2">
//                 <img
//                   src="assets/images/activity.png"
//                   className="img-fluid lft-img"
//                   alt="logo"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="col-sm-7 col-md-7 col-lg-6 mr-0 pr-0">
//             <div className="form-bg">
//               <form onSubmit={handleSubmit} className="form-style">
//                 <div className="row">
//                   <div className="col-sm-12 col-md-12 text-center mb-5">
//                     <h2 className="mdl-ttl">Login</h2>
//                   </div>
//                   <div className="col-sm-12 col-md-12 mb-4">
//                     <FormInputText
//                       onChange={handleChange}
//                       name="email"
//                       value={values.email}
//                       placeholder="Email Address"
//                     />
//                     <span className="errorMessage">
//                       {touched["email"] && errors["email"]}
//                     </span>
//                   </div>
//                   <div className="col-sm-12 col-md-12 mb-4">
//                     <FormInputPassword
//                       onChange={handleChange}
//                       name="password"
//                       value={values.password}
//                       placeholder="Password"
//                     />
//                     <span className="errorMessage">
//                       {touched["password"] && errors["password"]}
//                     </span>
//                   </div>
//                   <div className="col-sm-12 col-md-12 text-center mb-4">
//                     <Link to="/auth/forget-password" className="forgot-pass">
//                       Forgot Password?
//                     </Link>
//                   </div>
//                   <div className="col-sm-12 col-md-12 text-center">
//                     <button
//                       type="submit"
//                       className="btn btn-save w-100"
//                       disabled={isLoading}
//                     >
//                       {isLoading ? <Loader /> : "Log In"}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Login;

// src/pages/Auth/Login.jsx
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormInputPassword from "../../components/FormInputPassword";
import FormInputText from "../../components/FormInputText";
import { postRawData } from "../../services/httphandler";
import Loader from "../../components/loader";
import { useEffect, useState } from "react";
import TwoFAVerifyDialog from "../../components/twoFAVerifyDialog";

const Login = () => {
  useEffect(() => {
    // if you want to clear only auth cookies, name them explicitly
    Cookies.remove("t_k");
    Cookies.remove("adminData");
    Cookies.remove("t2_ok");
  }, []);

  const router = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [pendingAdminId, setPendingAdminId] = useState(null);
  const [postLoginPath] = useState("/admin/manage-countries");

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("*Invalid email").required("*Email is Required"),
    password: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("*Password is Required"),
  });

  const { values, handleSubmit, touched, errors, handleChange } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async () => {
      setIsLoading(true);
      const response = await postRawData("admin/login", values);
      // expect { code, data: { token, admin: { _id, twoFAEnabled, ... } } }
      if (response && response?.code === 1) {
        const token = response?.data?.token;
        const admin = response?.data?.admin || {};
        const twoFAEnabled = !!admin?.twoFAEnabled;

        // set token & admin basics (needed for calling /auth/2fa/verify)
        Cookies.set("t_k", token);
        Cookies.set(
          "adminData",
          JSON.stringify({
            name: admin?.name,
            role: admin?.role,
            permissions: admin?.permissions,
          })
        );

        if (twoFAEnabled) {
          // stop navigation; require 2FA code
          setPendingAdminId(admin?._id);
          setShow2FA(true);
          toast.info("Enter your 2FA code");
        } else {
          // no 2FA enforced: continue
          Cookies.set("t2_ok", "1"); // optional flag your PrivateRoute can check
          router(postLoginPath);
          toast.success("Success");
        }
      } else {
        toast.error(response?.message || "Login failed");
      }
      setIsLoading(false);
    },
  });

  const handle2FAVerified = () => {
    Cookies.set("t2_ok", "1"); // optional flag
    setShow2FA(false);
    router("/admin/manage-countries");
  };

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
                  <div className="col-sm-12 col-md-12 text-center mb-5">
                    <h2 className="mdl-ttl">Login</h2>
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

                  <div className="col-sm-12 col-md-12 mb-4">
                    <FormInputPassword
                      onChange={handleChange}
                      name="password"
                      value={values.password}
                      placeholder="Password"
                    />
                    <span className="errorMessage">
                      {touched["password"] && errors["password"]}
                    </span>
                  </div>

                  <div className="col-sm-12 col-md-12 text-center mb-4">
                    <Link to="/auth/forget-password" className="forgot-pass">
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="col-sm-12 col-md-12 text-center">
                    <button
                      type="submit"
                      className="btn btn-save w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader /> : "Log In"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Dialog */}
      <TwoFAVerifyDialog
        open={show2FA}
        adminId={pendingAdminId}
        onClose={() => setShow2FA(false)} // you can force 2FA by not allowing close
        onVerified={handle2FAVerified}
      />
    </section>
  );
};

export default Login;
