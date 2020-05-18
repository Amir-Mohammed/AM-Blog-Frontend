import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import queryString from "query-string";
import { Search as SearchIcon } from "react-bootstrap-icons";
import { toast } from "react-toastify";

const Search = () => {
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const searchedBlogs = (results) => {
    return (
      <div className="jumbotron bg-white">
        {message && <p className="pt-4 text-muted font-italic">{message}</p>}

        {results.map((blog, i) => {
          return (
            <div key={i}>
              <Link className="text-primary" to={`/blogs/${blog._id}`}>
                {blog.title}
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  const searchForm = () => (
    <Formik
      initialValues={{ search: "" }}
      onSubmit={async (values, { resetForm }) => {
        const query = queryString.stringify(values);
        try {
          const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URI}/blogs/search?${query}`
          );
          setResults(data);
          setMessage(`${data.length} was found`);
          setSearched(true);
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
          <div className="row">
            <div className="col-md-8">
              <Field
                type="search"
                name="search"
                className="form-control"
                placeholder="Search blogs"
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-block btn-outline-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                )}
                Search <SearchIcon />
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
  return (
    <div className="container-fluid">
      <div className="pt-3 pb-3">{searchForm()}</div>
      {searched && (
        <div style={{ marginTop: "-95px", marginBottom: "-80px" }}>
          {searchedBlogs(results)}
        </div>
      )}
    </div>
  );
};

export default Search;
