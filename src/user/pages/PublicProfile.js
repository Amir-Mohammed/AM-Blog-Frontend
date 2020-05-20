import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../helpers/context/auth-context";
import moment from "moment";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import ContactForm from "../components/ContactForm";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from "react-toastify";
import FollowProfileButton from "./../components/FollowProfileButton";
import { Newspaper, EnvelopeFill } from "react-bootstrap-icons";

const PublicProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState(null);
  const [following, setFollowing] = useState(false);

  const auth = useContext(AuthContext);

  const username = useParams().username;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user, blogs },
        } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/users/${username}`
        );
        setUser(user);
        setUserBlogs(blogs);
        setIsLoading(false);
      } catch (error) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Something went wrong. Please try again.");
      }
    };
    fetchData();
  }, [username]);

  useEffect(() => {
    const checkFollow = (user, id) => {
      setFollowing(user.followers.some((follower) => follower._id === id));
    };
    if (user) {
      checkFollow(user, auth.userId);
    }
  }, [user, auth.userId]);

  const handleFollowingClick = (callApi) => {
    callApi(username, auth).then((data) => {
      if (data) {
        setFollowing((following) => !following);
      }
    });
  };

  const showUserBlogs = () => {
    return userBlogs.map((blog, i) => {
      return (
        <tr key={i}>
          <td>
            <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
          </td>
        </tr>
      );
    });
  };
  return (
    <React.Fragment>
      {!isLoading && (
        <div className="container mt-3">
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col lg={4}>
                <Card
                  style={{
                    borderRadius: "20px 20px 5px 5px",
                  }}
                  className="card-profile"
                >
                  <Card.Header
                    style={{
                      textAlign: "center",
                      borderRadius: "20px 20px 0 0",
                    }}
                  >
                    <span className="text-capitalize">{user.username}</span>'s
                    Profile
                  </Card.Header>
                  <Card.Img variant="top" src={`${user.image}`} />
                  <Card.Body style={{ className: "text-center" }}>
                    <Nav variant="pills" className="flex-column mb-4 mt-3">
                      <Nav.Item>
                        <Nav.Link eventKey="first">Blogs</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="second">Contact</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <FollowProfileButton
                      following={following}
                      onButtonClick={handleFollowingClick}
                    />
                  </Card.Body>
                  <Card.Footer className="text-muted text-center">
                    Joined {moment(user.createdAt).fromNow()}
                  </Card.Footer>
                </Card>
              </Col>
              <Col lg={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <div className="card">
                      <h5 className="card-header">
                        <Newspaper /> Recent blogs by{" "}
                        <span className="text-capitalize">{user.username}</span>
                      </h5>
                      <div className="card-body">
                        {userBlogs.length ? (
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th scope="col">Blog Title</th>
                              </tr>
                            </thead>
                            <tbody>{showUserBlogs()}</tbody>
                          </table>
                        ) : (
                          <div>
                            <h6 className="text-muted pl-3 mt-3">
                              <span className="text-capitalize">
                                {user.username}
                              </span>{" "}
                              have no blogs...
                            </h6>
                          </div>
                        )}
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <div className="card">
                      <h5 className="card-header">
                        <EnvelopeFill /> Message{" "}
                        <span className="text-capitalize">{user.username}</span>
                      </h5>
                      <div className="card-body">
                        <ContactForm authorEmail={user.email} />
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      )}
    </React.Fragment>
  );
};

export default PublicProfile;
