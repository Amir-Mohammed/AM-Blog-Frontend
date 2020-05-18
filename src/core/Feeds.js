import React, { useState, useEffect, useContext } from "react";
import Card from "../blogs/components/Card";
import { Link } from "react-router-dom";
import Search from "../features/Search";
import axios from "axios";
import { AuthContext } from "../helpers/context/auth-context";
import { toast } from "react-toastify";

const Feeds = () => {
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [limit] = useState(3);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/feeds?limit=${limit}&skip=${skip}`
        );
        setBlogs((prevBlogs) => [...prevBlogs, ...data.blogs]);
        setTags(data.tags);
        setSize(data.count);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Something went wrong. Please try again.");
      }
    };
    fetchData();
  }, [limit, skip]);
  const showAllBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <article key={i}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });
  };
  const showAllTags = () => {
    return tags.map((t, i) => (
      <Link
        to={`/tags/${t.name}`}
        key={i}
        className="btn btn-outline-primary mr-1 ml-1 mt-3"
      >
        {t.name}
      </Link>
    ));
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size > limit + skip && (
        <button
          className="btn btn-outline-primary btn-lg"
          onClick={loadMore}
          disabled={loading}
        >
          {loading && (
            <span className="spinner-border spinner-border-sm mr-2"></span>
          )}
          Load more
        </button>
      )
    );
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    setSkip(toSkip);
  };

  return (
    <main>
      {auth.isLoggedIn && <Search />}
      <div className="container-fluid">
        <header>
          <div className="col-md-12 pt-3">
            <h1 className="display-4 font-weight-bold text-center">
              Javascript Tips &amp; Tricks
            </h1>
          </div>
          {!loading && (
            <section>
              <div className="pb-5 text-center">{showAllTags()}</div>
            </section>
          )}
        </header>
      </div>
      {!blogs.length && (
        <div className="d-flex justify-content-center mt-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {blogs.length && (
        <div>
          <div className="container-fluid">{showAllBlogs()}</div>
          <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
          {loading && (
            <div className="d-flex justify-content-center mt-4">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Feeds;
