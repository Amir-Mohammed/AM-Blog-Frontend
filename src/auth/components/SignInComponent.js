import React, { useContext } from "react";
import { Field, Form, Formik } from "formik";
import { ReactstrapInput } from "reactstrap-formik";
import { AuthContext } from "../../helpers/context/auth-context";
import { toast } from "react-toastify";
import axios from "axios";
import * as Yup from "yup";

const SignInComponent = () => {
  const auth = useContext(AuthContext);
  const SignInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum."),
  });
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={SignInSchema}
      onSubmit={async (values) => {
        try {
          const { data } = await axios.post(
            process.env.REACT_APP_BACKEND_URI + "/users/login",
            values
          );
          toast.success(
            `Welcome ${data.user.username}` || "Welcome to our Blogger"
          );
          auth.login(data.user.username, data.token, data.user._id);
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
            type="email"
            label="Email"
            name="email"
            id="email"
            component={ReactstrapInput}
          />
          <Field
            type="password"
            label="Password"
            name="password"
            id="password"
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
            SIGN IN
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default SignInComponent;
