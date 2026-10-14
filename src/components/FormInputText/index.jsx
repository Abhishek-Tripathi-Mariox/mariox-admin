const FormInputText = ({
  onChange,
  placeholder,
  value,
  name,
  image,
  title,
  type,
  min,
  readOnly,
  onBlur,
  onInput,
  disabled,
}) => {
  return (
    <div className="form-group">
      <label>{title || "Email Address"}</label>
      <div className="input-container">
        <input
          onChange={onChange}
          type={type || "email"}
          value={value}
          name={name}
          min={min || ""}
          className="form-control pl-5"
          placeholder={placeholder || "Email Address"}
          readOnly={readOnly}
          onBlur={onBlur}
          onInput={onInput}
          disabled={disabled}
        />
        <img
          alt=""
          src={image ? `assets/images/${image}` : "assets/images/email-id.png"}
          className="input-img"
        />
      </div>
    </div>
  );
};

export default FormInputText;
