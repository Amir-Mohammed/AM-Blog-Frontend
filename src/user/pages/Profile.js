import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/context/auth-context";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import EditProfileForm from "./../components/EditProfileForm";
import { Pencil } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import ChangePasswordForm from "./../components/ChangePasswordForm";
import DeleteBlog from "../components/DeleteBlogModel";
import DeleteAccountForm from "./../components/DeleteAccountForm";
import {
  PersonFill,
  PencilSquare,
  Newspaper,
  LockFill,
  XCircleFill,
} from "react-bootstrap-icons";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user, blogs },
      } = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/users/me`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setUser(user);
      setUserBlogs(blogs);
      setIsLoading(false);
    };
    try {
      fetchData();
    } catch (error) {
      error.response
        ? toast.error(error.response.data.message)
        : toast.error("Something went wrong. Please try again.");
    }
  }, [auth.token]);

  const handleEdit = ({ user }) => {
    setUser(user);
  };

  const handleBlogDelete = async (blog) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URI}/blogs/${blog._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setUserBlogs(userBlogs.filter((b) => b !== blog));
      toast.success("Blog was deleted successfully");
    } catch (error) {
      error.response
        ? toast.error(error.response.data.message)
        : toast.error("Something went wrong. Please try again.");
    }
  };

  const showUserBlogs = () => {
    return userBlogs.map((blog, i) => {
      return (
        <tr key={i}>
          <td style={{ width: "75%" }}>
            <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
          </td>
          <td>
            <Link className="btn" to={`/blogs/update/${blog._id}`}>
              <Pencil size={25} color="green" />
            </Link>
          </td>
          <td>
            <DeleteBlog handleBlogDelete={handleBlogDelete} blog={blog} />
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
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="first">Personal Info</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="second">Edit Profile</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="third">Blogs</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="fourth">Manage Account</Nav.Link>
                      </Nav.Item>
                    </Nav>
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
                        <PersonFill /> Personal Info
                      </h5>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <tbody>
                              <tr>
                                <th scope="col">Username</th>
                                <td>
                                  <span className="text-capitalize">
                                    {user.username}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <th>Email</th>
                                <td>{user.email}</td>
                              </tr>
                              <tr>
                                <th>About me</th>
                                <td
                                  style={{
                                    wordWrap: "break-word",
                                    minWidth: 160,
                                    maxWidth: 160,
                                  }}
                                >
                                  {user.about ||
                                    "You haven't write anything yet..."}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <div className="card">
                      <h5 className="card-header">
                        <PencilSquare /> Edit profile
                      </h5>
                      <div className="card-body">
                        <EditProfileForm user={user} onUserEdit={handleEdit} />
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <div className="card">
                      <h5 className="card-header">
                        <Newspaper /> Recent blogs
                      </h5>
                      <div className="card-body">
                        {userBlogs.length ? (
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th scope="col" style={{ width: "75%" }}>
                                  Blog Title
                                </th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                              </tr>
                            </thead>
                            <tbody>{showUserBlogs()}</tbody>
                          </table>
                        ) : (
                          <div>
                            <h6 className="text-muted pl-3 mt-3">
                              You have no blogs...
                            </h6>
                            <h6 className="text-muted pl-3 mt-3">
                              Start writing from{" "}
                              <Link to="/Blogs/create">here</Link>
                            </h6>
                          </div>
                        )}
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="fourth">
                    <div className="card">
                      <h5 className="card-header">
                        <LockFill /> Change password
                      </h5>
                      <div className="card-body">
                        <ChangePasswordForm />
                      </div>
                    </div>
                    <div className="card mt-4">
                      <h5 className="card-header">
                        <XCircleFill /> Delete account
                      </h5>
                      <div className="card-body">
                        <DeleteAccountForm />
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

export default Profile;
