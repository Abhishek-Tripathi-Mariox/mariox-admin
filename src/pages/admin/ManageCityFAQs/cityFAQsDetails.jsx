import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormInputText from "../../../components/FormInputText";
import { cityFAQDetails } from "./cityFAQSlice"; // 👈 make sure this thunk exists

const CityFAQDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [params, setParams] = useState({
    question: "",
    answer: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(cityFAQDetails({ id })).then((res) => {
        const data = res?.payload;
        if (data) {
          setParams({
            question: data.question || "",
            answer: data.answer || "",
            createdAt: new Date(data.createdAt).toLocaleString(),
            updatedAt: new Date(data.updatedAt).toLocaleString(),
          });
        }
      });
    }
  }, [dispatch, id]);

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <div className="row">
          <div className="col-sm-12">
            <h2 className="head-title">City FAQ Details</h2>
            <form className="form-style row">
              <div className="col-md-6 mb-3">
                <FormInputText
                  readOnly
                  title="Question"
                  name="question"
                  value={params.question}
                />
              </div>
              <div className="col-md-6 mb-3">
                <FormInputText
                  readOnly
                  title="Answer"
                  name="answer"
                  value={params.answer}
                />
              </div>
              <div className="col-md-6 mb-3">
                <FormInputText
                  readOnly
                  title="Created At"
                  name="createdAt"
                  value={params.createdAt}
                />
              </div>
              <div className="col-md-6 mb-3">
                <FormInputText
                  readOnly
                  title="Updated At"
                  name="updatedAt"
                  value={params.updatedAt}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CityFAQDetails;
