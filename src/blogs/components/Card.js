import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Card = ({ blog }) => {
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
    <div className="lead pb-4">
      <header>
        <Link to={`/blogs/${blog._id}`}>
          <h2 className="pt-3 pb-3 font-weight-bold">{blog.title}</h2>
        </Link>
      </header>
      <section>
        <p className="mark ml-1 pt-2 pb-2">
          Written by{" "}
          <Link to={`/profile/${blog.postedBy.username}`}>
            <span className="text-capitalize">{blog.postedBy.username}</span>
          </Link>{" "}
          | Published {moment(blog.updatedAt).fromNow()}
        </p>
      </section>
      <section>
        {showBlogTags(blog)}
        <br />
        <br />
      </section>

      <div className="row">
        <div className="col-md-4">
          <section>
            <img
              className="img img-fluid"
              style={{ maxHeight: "auto", width: "100%" }}
              src={`${blog.image}`}
              alt={blog.title}
            />
          </section>
        </div>
        <div className="col-md-8">
          <section>
            <div className="pb-3">{blog.excerpt}</div>
            <Link to={`/blogs/${blog._id}`} className="btn btn-primary pt-2">
              Read more
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Card;
