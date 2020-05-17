import React from "react";
import { Field, Form, Formik } from "formik";
import { ReactstrapInput } from "reactstrap-formik";
import { toast } from "react-toastify";
import axios from "axios";
import * as Yup from "yup";

const ContactForm = ({ authorEmail }) => {
  const ContactSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    message: Yup.string()
      .required("Message is required")
      .min(20, "Message is too short - should be 20 chars minimum."),
  });
  return (
    <Formik
      initialValues={{ name: "", email: "", message: "" }}
      validationSchema={ContactSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          if (authorEmail) {
            await axios.post(
              process.env.REACT_APP_BACKEND_URI + "/contact/blog-author",
              { ...values, authorEmail }
            );
          } else {
            await axios.post(
              process.env.REACT_APP_BACKEND_URI + "/contact",
              values
            );
          }
          toast.success(`Message was sent successfully`);
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
          <div className="form-group">
            <Field
              type="textarea"
              rows="6"
              label="Message"
              name="message"
              id="message"
              component={ReactstrapInput}
            />
          </div>
          <Field
            type="name"
            name="name"
            label="Name"
            id="name"
            placeholder="Type your name"
            component={ReactstrapInput}
          />
          <Field
            type="email"
            label="Email"
            placeholder="Type your email address"
            name="email"
            id="email"
            component={ReactstrapInput}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-2"></span>
            )}
            Send
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;
