import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormInputText from "../../../components/FormInputText";
import { AddFaqs } from "./faqSlice";
import Loader from "../../../components/loader";
import { useState } from "react";

const AddFaq = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    question: Yup.string().required("*Question is Required"),
    answer: Yup.string().required("*Answer is Required"),
  });

  const { values, handleSubmit, touched, errors, handleChange } = useFormik({
    initialValues: {
      question: "",
      answer: "",
    },
    validationSchema,
    onSubmit: async () => {
      setIsLoading(true);
      dispatch(AddFaqs(values, { dispatch })).then((data) => {
        setIsLoading(false);
        if (data?.payload?.code === 1) {
          history("/admin/faqs");
          toast.success("Success");
        } else {
          toast.error(data?.payload?.message);
        }
      });
    },
  });

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center col-rever">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h2 className="head-title">Add New Faq</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit} className="form-style">
              <div className="row">
                <div className="col-sm-12 col-md-2 col-lg-2"></div>
                <div className="col-sm-12 col-md-8 col-lg-8">
                  <FormInputText
                    placeholder="Question"
                    image="small-cate.png"
                    onChange={handleChange}
                    name="question"
                    type="text"
                    value={values.question}
                    title="Question"
                  />

                  <span className="errorMessage">
                    {touched["question"] && errors["question"]}
                  </span>
                </div>
                <div className="col-sm-12 col-md-2 col-lg-2"></div>
                <div className="col-sm-12 col-md-2 col-lg-2"></div>
                <div className="col-sm-12 col-md-8 col-lg-8">
                  <div className="form-group">
                    <label>Answer</label>
                    <div className="input-container">
                      <textarea
                        onChange={handleChange}
                        value={values.answer}
                        name="answer"
                        className="textarea-control"
                        rows="7"
                      ></textarea>
                    </div>
                  </div>
                  <span className="errorMessage">
                    {touched["answer"] && errors["answer"]}
                  </span>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-save"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader /> : "Save"}
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

export default AddFaq;
