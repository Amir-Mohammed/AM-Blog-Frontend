import React, { useContext } from "react";
import { Field, Form, Formik } from "formik";
import { ReactstrapInput } from "reactstrap-formik";
import * as Yup from "yup";
import { AuthContext } from "../../helpers/context/auth-context";
import { toast } from "react-toastify";
import axios from "axios";

const ChangePasswordForm = ({ user, onUserEdit }) => {
  const auth = useContext(AuthContext);
  const ChangePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Password must contain at least one lowercase letter, one uppercase letter and one special character"
      ),
    newPassword: Yup.string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Password must contain at least one lowercase letter, one uppercase letter and one special character"
      ),
    newPasswordConfirmation: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });
  return (
    <Formik
      initialValues={{
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
      }}
      validationSchema={ChangePasswordSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          await axios.patch(
            process.env.REACT_APP_BACKEND_URI + "/users/me/password",
            values,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );
          toast.success(`Password has been changed successfully`);
          resetForm();
        } catch (error) {
          error.response
            ? toast.error(error.response.data.message)
            : toast.error("Something went wrong. Please try again.");
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field
            type="password"
            label="Old Password"
            name="oldPassword"
            id="oldPassword"
            component={ReactstrapInput}
          />
          <Field
            type="password"
            label="new Password"
            name="newPassword"
            id="newPassword"
            component={ReactstrapInput}
          />
          <Field
            type="password"
            label="Confirm new password"
            name="newPasswordConfirmation"
            id="newPasswordConfirmation"
            component={ReactstrapInput}
          />
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-2"></span>
            )}
            Save Changes
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordForm;
