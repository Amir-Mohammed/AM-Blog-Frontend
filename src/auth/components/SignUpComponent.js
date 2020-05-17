import React, { useContext } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { ReactstrapInput } from "reactstrap-formik";
import * as Yup from "yup";
import { AuthContext } from "../../helpers/context/auth-context";
import { toast } from "react-toastify";
import axios from "axios";
import FileUpload from "../../helpers/FileUpload/FileUpload";

const SignUpComponent = (props) => {
  const auth = useContext(AuthContext);
  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Too Short!")
      .max(50, "Too Long!")
      .required("Username is required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Password must contain at least one lowercase letter, one uppercase letter and one special character"
      ),
    confirmPassword: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    image: Yup.mixed()
      .required("Profile image is required")
      .test("fileType", "Unsupported File Format", (value) =>
        ["image/jpg", "image/jpeg", "image/gif", "image/png"].includes(
          value && value.type
        )
      )
      .test(
        "fileSize",
        "Image Size is too large",
        (value) => value && value.size <= 1000000
      ),
  });
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: null,
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values, { setErrors }) => {
        const formData = new FormData();
        Object.keys(values).forEach((value) =>
          formData.append(value, values[value])
        );
        try {
          const { data } = await axios.post(
            process.env.REACT_APP_BACKEND_URI + "/users/signup",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
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
          <div className="row">
            <div className="col-md-8">
              <Field
                type="text"
                label="Username"
                name="username"
                id="username"
                component={ReactstrapInput}
              />
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
              <Field
                type="password"
                label="confirm password"
                name="confirmPassword"
                id="confirmPassword"
                component={ReactstrapInput}
              />
            </div>
            <div className="col-md-4">
              <Field
                name="image"
                description="Profile"
                component={FileUpload}
              />
              <ErrorMessage name="image">
                {(msg) => <div className="invalid">{msg}</div>}
              </ErrorMessage>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              SIGN UP
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpComponent;
