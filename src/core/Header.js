import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../helpers/context/auth-context";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Person } from "react-bootstrap-icons";

const Header = () => {
  const auth = useContext(AuthContext);
  return (
    <React.Fragment>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/feeds">
          <span>AM</span> <span>Blog</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/contact">
              Contact Us
            </Nav.Link>
          </Nav>
          {!auth.isLoggedIn && (
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/signUp">
                Sign Up
              </Nav.Link>
              <Link className="btn btn-outline-primary" to="/signIn">
                Sign In
              </Link>
            </Nav>
          )}
          {auth.isLoggedIn && (
            <Nav className="ml-auto">
              <Link className="btn btn-outline-primary" to="/Blogs/create">
                Write a blog
              </Link>
              <Nav.Link as={Link} to="/feeds/me">
                Feeds
              </Nav.Link>
              <Nav.Link as={Link} to="/profile/me" color="royalblue">
                Profile <Person />
              </Nav.Link>
              <Nav.Link as={Link} to="/signIn" onClick={auth.logout}>
                Logout
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
    </React.Fragment>
  );
};

export default Header;
