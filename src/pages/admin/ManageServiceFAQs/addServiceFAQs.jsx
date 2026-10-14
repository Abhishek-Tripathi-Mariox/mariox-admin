import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormInputText from "../../../components/FormInputText";
import { addServiceFAQs } from "./serviceFAQSlice";

const AddServiceFAQS = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    question: Yup.string().required("*Question is required"),
    answer: Yup.string().required("*Answer is required"),
  });

  const formik = useFormik({
    initialValues: {
      question: "",
      answer: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const response = await dispatch(addServiceFAQs(values));
      const { payload } = response || {};

      if (payload?.code === 1) {
        toast.success("Service FAQ added successfully");
        navigate("/admin/manage-service-faqs");
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
            <h2 className="head-title">Add New Service FAQ</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <form onSubmit={handleSubmit} className="form-style">
              <div className="row">
                <div className="col-md-12">
                  <FormInputText
                    placeholder="Enter Question"
                    type="text"
                    image="question.png"
                    name="question"
                    value={values.question}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    title="Question"
                  />
                  <span className="errorMessage">
                    {touched.question && errors.question}
                  </span>
                </div>

                <div className="col-md-12">
                  <FormInputText
                    placeholder="Enter Answer"
                    type="text"
                    image="answer.png"
                    name="answer"
                    value={values.answer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    title="Answer"
                  />
                  <span className="errorMessage">
                    {touched.answer && errors.answer}
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

export default AddServiceFAQS;
