import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import Card from "./../components/Card";
import { toast } from "react-toastify";

const Tag = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tag, setTag] = useState({});
  const history = useHistory();

  const tagName = useParams().name;

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/tags/${tagName}`
        );
        setBlogs(data.blogs);
        setTag(data.tag);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.request.status === 404) {
          toast.error("Oops... page not found.");
          history.push("/blogs");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      }
    };
    fetch();
  }, [tagName, history]);

  return (
    <React.Fragment>
      <main>
        <div className="container-fluid">
          <header>
            {loading && (
              <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            {!loading && (
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">
                  {tag.name}
                </h1>
                {blogs.map((b, i) => (
                  <div key={i}>
                    <Card blog={b} />
                    <hr />
                  </div>
                ))}
              </div>
            )}
          </header>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Tag;
