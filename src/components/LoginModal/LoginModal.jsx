import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";
import "./LoginModal.css";

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
  onSwitchToRegister,
}) {
  const defaultValues = {
    email: "",
    password: "",
  };

  const { values, handleChange, setValues } = useForm(defaultValues);

  // Form is valid if both fields are non-empty
  const isFormValid = values.email && values.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await onLogin(values);
      setValues(defaultValues);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid email or password.");
    }
  };

  return (
    <ModalWithForm
      title="Log in"
      buttonText="Log in"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="modal__label login-label">
        Email
        <input
          type="email"
          name="email"
          className="modal__input"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          required
        />
      </label>

      <label className="modal__label login-label">
        Password
        <input
          type="password"
          name="password"
          className="modal__input"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          required
        />
      </label>

      <div className="modal__footer login-footer">
        <button
          type="submit"
          className={`modal__submit login-button ${
            isFormValid ? "login-button_active" : ""
          }`}
          disabled={!isFormValid}
        >
          Log in
        </button>

        <p className="login__switch">
          or{" "}
          <span
            className="login__switch-link"
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </ModalWithForm>
  );
}
