import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import FormInputText from "../../../components/FormInputText";
import { specializationCityFAQDetails } from "./specializationCityFAQSlice";

const SpecializationCityFAQDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [details, setDetails] = useState({
    question: "",
    answer: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(specializationCityFAQDetails({ id })).then((res) => {
        const data = res?.payload;
        if (data) {
          setDetails({
            question: data.question || "",
            answer: data.answer || "",
            createdAt: data.createdAt
              ? new Date(data.createdAt).toLocaleString()
              : "-",
            updatedAt: data.updatedAt
              ? new Date(data.updatedAt).toLocaleString()
              : "-",
          });
        } else {
          toast.error("FAQ not found");
          navigate("/admin/manage-specializations-city-faqs");
        }
      });
    }
  }, [dispatch, id, navigate]);

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row align-items-center col-rever">
          <div className="col-12">
            <h2 className="head-title">Specialization City FAQ Details</h2>
          </div>
        </div>
        <form className="form-style row mt-3">
          <div className="col-md-6 mb-3">
            <FormInputText
              readOnly
              title="Question"
              name="question"
              value={details.question}
            />
          </div>
          <div className="col-md-6 mb-3">
            <FormInputText
              readOnly
              title="Answer"
              name="answer"
              value={details.answer}
            />
          </div>
          <div className="col-md-6 mb-3">
            <FormInputText
              readOnly
              title="Created At"
              name="createdAt"
              value={details.createdAt}
            />
          </div>
          <div className="col-md-6 mb-3">
            <FormInputText
              readOnly
              title="Updated At"
              name="updatedAt"
              value={details.updatedAt}
            />
          </div>
        </form>
      </div>
    </article>
  );
};

export default SpecializationCityFAQDetails;
