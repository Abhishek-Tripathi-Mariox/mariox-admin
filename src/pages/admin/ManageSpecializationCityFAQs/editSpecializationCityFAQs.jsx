import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormInputText from "../../../components/FormInputText";
import {
  addSpecializationCityFAQs,
  specializationCityFAQDetails,
} from "./specializationCityFAQSlice";

const EditSpecializationCityFAQ = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    question: "",
    answer: "",
    faqId: id,
  });

  useEffect(() => {
    if (id) {
      dispatch(specializationCityFAQDetails({ id })).then((res) => {
        const faq = res?.payload;
        if (faq) {
          setInitialValues({
            question: faq.question || "",
            answer: faq.answer || "",
            faqId: faq._id,
          });
        } else {
          toast.error("FAQ not found");
          navigate("/admin/manage-specializations-city-faqs");
        }
      });
    }
  }, [dispatch, id, navigate]);

  const validationSchema = Yup.object().shape({
    question: Yup.string().required("*Question is required"),
    answer: Yup.string().required("*Answer is required"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const response = await dispatch(addSpecializationCityFAQs(values));
        const { payload } = response || {};

        if (payload?.code === 1) {
          toast.success("City FAQ updated successfully");
          navigate("/admin/manage-specializations-city-faqs");
        } else {
          toast.error(payload?.message || "Something went wrong");
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
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
            <h2 className="head-title">Edit Specialization City FAQ</h2>
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
                  {touched.question && errors.question && (
                    <span className="errorMessage">{errors.question}</span>
                  )}
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
                  {touched.answer && errors.answer && (
                    <span className="errorMessage">{errors.answer}</span>
                  )}
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

export default EditSpecializationCityFAQ;
