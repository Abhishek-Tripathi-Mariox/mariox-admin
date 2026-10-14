// src/components/TwoFAVerifyDialog.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import { verifyTwoFA } from "../../services/httphandler";

const schema = Yup.object().shape({
  token: Yup.string()
    .required("Required")
    .matches(/^\d{6}$/, "Enter 6 digits"),
});

export default function TwoFAVerifyDialog({
  open,
  onClose,
  adminId,
  onVerified,
}) {
  const [submitting, setSubmitting] = useState(false);

  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: { token: "" },
    validationSchema: schema,
    onSubmit: async (vals) => {
      try {
        setSubmitting(true);
        const res = await verifyTwoFA({ token: vals.token.trim(), adminId });
        // Expecting your backend’s standard { code, message, data }
        if (res?.code === 1 && res?.data?.verified) {
          toast.success("2FA verified");
          onVerified?.(res?.data);
        } else {
          toast.error(res?.message || "Invalid code");
        }
      } catch (e) {
        toast.error("Network / server error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!open) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,.35)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">2-Step Verification</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={submitting}
            />
          </div>
          <div className="modal-body">
            <p className="mb-3">
              Enter the 6-digit code from your Authenticator app.
            </p>
            <form onSubmit={handleSubmit}>
              <input
                name="token"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                className="form-control mb-2"
                placeholder="123456"
                value={values.token}
                onChange={(e) => {
                  // keep only digits
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  e.target.value = v;
                  handleChange(e);
                }}
                autoFocus
              />
              {touched.token && errors.token ? (
                <div className="text-danger small mb-2">{errors.token}</div>
              ) : null}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={submitting || values.token.length !== 6}
              >
                {submitting ? "Verifying..." : "Verify"}
              </button>
            </form>
          </div>
          <div className="modal-footer">
            <small className="text-muted">
              Time-based one-time password (TOTP)
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
