import { useState } from "react";

const FormInputPassword = ({ onChange, placeholder, value, name, label }) => {
  const [state, setstate] = useState(false);
  return (
    <div className="form-group">
      <label>{label ? label : "Password"}</label>
      <div className="input-container">
        <input
          onChange={onChange}
          type={state ? "text" : "password"}
          className="form-control pl-5"
          placeholder={placeholder || "Password"}
          value={value}
          name={name}
        />

        <img alt="" src="assets/images/password.png" className="input-img" />
        <span
          style={{ cursor: "pointer" }}
          onClick={() => setstate(!state)}
          className="pass-view field-icon toggle-password"
        ></span>
      </div>
    </div>
  );
};

export default FormInputPassword;
