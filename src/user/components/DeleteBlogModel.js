import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Trash } from "react-bootstrap-icons";

const DeleteBlog = ({ handleBlogDelete, blog }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <React.Fragment>
      <Button variant="link" onClick={handleShow}>
        <Trash size={25} color="red" />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deleting a blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete this blog?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleClose();
              handleBlogDelete(blog);
            }}
          >
            Delete Blog
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteBlog;
