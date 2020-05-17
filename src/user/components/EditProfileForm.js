import React, { useContext } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { ReactstrapInput } from "reactstrap-formik";
import * as Yup from "yup";
import { AuthContext } from "../../helpers/context/auth-context";
import { toast } from "react-toastify";
import axios from "axios";
import FileUpload from "../../helpers/FileUpload/FileUpload";

const EditProfileForm = ({ user, onUserEdit }) => {
  const auth = useContext(AuthContext);
  const EditProfileSchema = Yup.object().shape({
    username: Yup.string().min(3, "Too Short!").max(50, "Too Long!"),
    email: Yup.string().email("Invalid email"),
    about: Yup.string().min(10, "Too Short!").max(100, "Too Long!"),
    image: Yup.mixed().notRequired(),
  });
  return (
    <Formik
      initialValues={{
        username: user.username,
        email: user.email,
        about: user.about || "",
        image: "",
      }}
      validationSchema={EditProfileSchema}
      onSubmit={async (values) => {
        const formData = new FormData();
        Object.keys(values).forEach((value) =>
          formData.append(value, values[value])
        );
        try {
          const { data } = await axios.patch(
            process.env.REACT_APP_BACKEND_URI + "/users/me",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );
          onUserEdit(data);
          toast.success("Profile was updated successfully");
        } catch ({ response }) {
          toast.error(
            response.data.message || "Something went wrong. Please try again"
          );
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
                type="textarea"
                label="About me"
                name="about"
                id="about"
                rows="7"
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
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditProfileForm;
