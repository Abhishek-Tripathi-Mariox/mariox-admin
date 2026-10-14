import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormInputText from "../../../components/FormInputText";
import { addSubAdmin, subAdminDetails } from "./subAdminsSlice";

const EditSubAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    pageName: "",
    slug: "",
    SubAdminId: id,
  });

  useEffect(() => {
    dispatch(subAdminDetails({ id })).then((data) => {
      if (data?.payload) {
        setInitialValues({
          pageName: data.payload.pageName || "",
          slug: data.payload.slug || "",
          SubAdminId: data.payload._id,
        });
      }
    });
  }, [dispatch, id]);

  const validationSchema = Yup.object().shape({
    pageName: Yup.string().required("*SubAdmin Name is required"),
    slug: Yup.string().required("*Slug is required"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const response = await dispatch(addSubAdmin(values));
      const { payload } = response || {};

      if (payload?.code === 1) {
        toast.success("SubAdmin updated successfully");
        navigate("/admin/manage-subAdmins");
      } else {
        toast.error(payload?.message || "Something went wrong");
        setIsSubmitting(false);
      }
    },
  });

  const { values, handleSubmit, touched, errors, handleChange, handleBlur } =
    formik;

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center col-rever">
          <div className="col-12">
            <h2 className="head-title">Edit SubAdmin</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <form onSubmit={handleSubmit} className="form-style">
              <div className="row">
                <div className="col-md-6">
                  <FormInputText
                    placeholder="Enter Slug"
                    type="text"
                    image="subAdmin.png"
                    name="slug"
                    value={values.slug}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    title="Slug"
                  />
                  <span className="errorMessage">
                    {touched.slug && errors.slug}
                  </span>
                </div>

                <div className="col-md-6">
                  <FormInputText
                    placeholder="Enter SubAdmin Name"
                    type="text"
                    image="subAdmin.png"
                    name="pageName"
                    value={values.pageName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    title="SubAdmin Name"
                  />
                  <span className="errorMessage">
                    {touched.pageName && errors.pageName}
                  </span>
                </div>

                <div className="col-12 mt-5 text-center">
                  <button
                    type="submit"
                    className="btn btn-save"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
};

export default EditSubAdmin;
