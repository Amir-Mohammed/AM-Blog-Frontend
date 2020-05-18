import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import moment from "moment";
import renderHTML from "react-render-html";
import axios from "axios";
import DisqusThread from "../../helpers/DisqusThread";
import Search from "./../../features/Search";
import { AuthContext } from "../../helpers/context/auth-context";
import { toast } from "react-toastify";

const Blog = () => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const blogId = useParams().id;
  const history = useHistory();

  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/blogs/${blogId}`
        );
        setBlog(data);
        setLoading(false);
      } catch (error) {
        if (error.request.status === 404) {
          toast.error("Oops... page not found.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        history.push("/blogs");
      }
    };
    fetch();
  }, [blogId, history]);

  const showComments = () => {
    return (
      <div>
        <DisqusThread
          id={blog._id}
          title={blog.title}
          path={`/blogs/${blogId}`}
        />
      </div>
    );
  };

  const showBlogTags = (blog) =>
    blog.tags.map((t, i) => (
      <Link
        key={i}
        to={`/tags/${t.name}`}
        className="btn btn-outline-primary mr-1 ml-1 mt-3"
      >
        {t.name}
      </Link>
    ));

  return (
    <React.Fragment>
      {auth.isLoggedIn && <Search />}
      {loading && (
        <div className="d-flex justify-content-center mt-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {!loading && (
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row" style={{ marginTop: "-30px" }}>
                  <img
                    src={`${blog.image}`}
                    alt={blog.title}
                    className="img img-fluid featured-image"
                  />
                </div>
              </section>
              <section>
                <div className="container">
                  <div className="col-md-12 pt-3 pt-3">
                    <h1 className="display-4 font-weight-bold text-center">
                      {blog.title}
                    </h1>
                  </div>
                  <p className="lead mt-3 mark">
                    Written by{" "}
                    <Link to={`/profile/${blog.postedBy.username}`}>
                      <span className="text-capitalize">
                        {blog.postedBy.username}
                      </span>
                    </Link>{" "}
                    | Published {moment(blog.updatedAt).fromNow()}
                  </p>
                  <div className="pb-3">
                    {showBlogTags(blog)}
                    <br />
                    <br />
                  </div>
                </div>
              </section>
            </div>

            <div className="container">
              <section>
                <div className="col-md-12 lead">{renderHTML(blog.body)}</div>
              </section>
            </div>

            {/* <div className="container">
                            <h4 className="text-center pt-5 pb-5 h2">RELATED BLOGS</h4>
                            <div className="row">{showRelatedBlog()}</div>
                        </div>*/}

            <div className="container pt-5 pb-5">{showComments()}</div>
          </article>
        </main>
      )}
    </React.Fragment>
  );
};

export default Blog;
