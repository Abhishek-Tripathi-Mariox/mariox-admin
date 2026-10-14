import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";

import FormInputText from "../../../components/FormInputText";
import { addSpecializationCityFAQs } from "./specializationCityFAQSlice";
import { specializationList } from "../ManageServices/serviceSlice";

const AddSpecializationCityFAQS = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [specializationId, setSpecializationId] = useState("");

  const specializationData = useSelector(
    (state) => state.service.specializationList || []
  );

  useEffect(() => {
    dispatch(specializationList({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const specializationOptions = specializationData.map((spec) => ({
    value: spec._id,
    label: spec.pageName,
  }));

  const handleChange = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const addNewFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFAQ = (index) => {
    if (faqs.length > 1) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!specializationId) {
      toast.error("Please select a service");
      return;
    }

    const isValid = faqs.every(
      (faq) => faq.question.trim() && faq.answer.trim()
    );
    if (!isValid) {
      toast.error("Please fill all questions and answers.");
      return;
    }

    const payload = faqs.map((faq) => ({
      ...faq,
      specializationId,
    }));

    try {
      setIsSubmitting(true);
      const response = await dispatch(addSpecializationCityFAQs(payload));
      const { payload: result } = response || {};

      if (result?.code === 1) {
        toast.success("FAQs added successfully");
        navigate("/admin/manage-specializations-city-faqs");
      } else {
        toast.error(result?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="col-lg-9">
      <div className="article-body store-bd-gy">
        <h2 className="head-title">Add Specialization City FAQs</h2>

        <form onSubmit={handleSubmit} className="form-style">
          <div className="row mb-4">
            <div className="col-md-6">
              <label>Select Specialization</label>
              <Select
                options={specializationOptions}
                placeholder="Select Service"
                onChange={(opt) => setSpecializationId(opt?.value)}
                value={specializationOptions.find(
                  (opt) => opt.value === specializationId
                )}
              />
            </div>
          </div>

          {faqs.map((faq, index) => (
            <div key={index} className="faq-entry mb-4">
              <FormInputText
                placeholder="Enter Question"
                type="text"
                name={`question-${index}`}
                value={faq.question}
                onChange={(e) =>
                  handleChange(index, "question", e.target.value)
                }
                title={`Question ${index + 1}`}
              />
              <FormInputText
                placeholder="Enter Answer"
                type="text"
                name={`answer-${index}`}
                value={faq.answer}
                onChange={(e) => handleChange(index, "answer", e.target.value)}
                title={`Answer ${index + 1}`}
              />
              {faqs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFAQ(index)}
                  className="btn btn-danger mt-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <div className="text-center">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addNewFAQ}
            >
              + Add Another FAQ
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save All"}
            </button>
          </div>
        </form>
      </div>
    </article>
  );
};

export default AddSpecializationCityFAQS;
