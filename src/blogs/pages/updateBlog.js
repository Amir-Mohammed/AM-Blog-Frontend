import React, { useState, useContext, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../helpers/context/auth-context";
import { toast } from "react-toastify";
import { ReactstrapInput } from "reactstrap-formik";
import axios from "axios";
import { QuillModules, QuillFormats } from "../../helpers/quill";
import FileUpload from "../../helpers/FileUpload/FileUpload";
import { useHistory, useParams } from "react-router-dom";

const UpdateBlog = () => {
  const auth = useContext(AuthContext);
  const [blog, setBlog] = useState({});
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const blogId = useParams().id;
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/blogs/${blogId}`
        );
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/tags`
        );
        setBlog(data);
        setTags(response.data);
        setIsLoading(false);
      } catch (error) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Something went wrong. Please try again.");
      }
    };
    fetchData();
  }, [blogId, history]);

  const updateBlogSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .min(3, "Too Short!")
      .max(160, "Too Long!")
      .required("Required"),
    body: Yup.string()
      .required("Required")
      .min(200, "Too Short!")
      .max(1000000, "Too Long!"),
    tags: Yup.array().required("At least one tag is required"),
    image: Yup.mixed()
      .required("Feature image is required")
      .test(
        "fileType",
        "Unsupported File Format. Try to upload .jpg, .jpeg or .png files",
        (value) =>
          ["image/jpg", "image/jpeg", "image/png"].includes(value && value.type)
      )
      .test(
        "fileSize",
        "File Size is too large",
        (value) => value && value.size <= 1000000
      ),
  });
  return (
    <React.Fragment>
      {isLoading && (
        <div className="d-flex justify-content-center mt-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {!isLoading && (
        <Formik
          initialValues={{
            title: blog.title,
            body: blog.body,
            image: null,
          }}
          validationSchema={updateBlogSchema}
          onSubmit={async (values) => {
            const formData = new FormData();
            Object.keys(values).forEach((value) =>
              formData.append(value, values[value])
            );
            try {
              await axios.put(
                `${process.env.REACT_APP_BACKEND_URI}/blogs/${blogId}`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              toast.success("Blog was updated successfully");
              history.push(`/blogs/${blogId}`);
            } catch (error) {
              error.response
                ? toast.error(error.response.data.message)
                : toast.error("Something went wrong. Please try again.");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="container-fluid pt-4">
                <h2 className="mb-4">Update blog</h2>
                <div className="row">
                  <div className="col-md-8">
                    <Field
                      type="text"
                      name="title"
                      label="Title"
                      component={ReactstrapInput}
                    />
                    <Field name="body">
                      {({ field }) => (
                        <ReactQuill
                          modules={QuillModules}
                          formats={QuillFormats}
                          placeholder="Write something amazing..."
                          value={field.value}
                          onChange={field.onChange(field.name)}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="body">
                      {(msg) => <div className="invalid">{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="col-md-4">
                    <Field
                      name="image"
                      description="Blog"
                      component={FileUpload}
                    />
                    <ErrorMessage name="image">
                      {(msg) => <div className="invalid">{msg}</div>}
                    </ErrorMessage>
                    <div>
                      <h5>Tags</h5>
                      <hr />
                      <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
                        {tags.map((t, i) => (
                          <li key={i} className="list-unstyled">
                            <label>
                              <Field
                                name="tags"
                                type="checkbox"
                                value={t._id}
                                // checked={blog.tags.find(
                                //   (tag) => tag.name === t.name
                                // )}
                              />
                              {t.name}
                            </label>
                          </li>
                        ))}
                      </ul>
                      <ErrorMessage name="tags">
                        {(msg) => <div className="invalid">{msg}</div>}
                      </ErrorMessage>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary mt-3 ml-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                    )}
                    Save
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </React.Fragment>
  );
};

export default UpdateBlog;
