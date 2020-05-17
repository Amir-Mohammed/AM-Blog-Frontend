import React, { useState, useContext } from "react";
import { Field, Form, Formik } from "formik";
import { ReactstrapInput } from "reactstrap-formik";
import { AuthContext } from "../../helpers/context/auth-context";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import axios from "axios";

const DeleteAccountForm = ({ user, onUserEdit }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const auth = useContext(AuthContext);

  const handleSubmit = async (values) => {
    try {
      await axios.delete(process.env.REACT_APP_BACKEND_URI + "/users", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        data: values,
      });
      toast.success(`Account was deleted successfully`);
      auth.logout();
    } catch (error) {
      error.response
        ? toast.error(error.response.data.message)
        : toast.error("Something went wrong. Please try again.");
    }
    handleClose();
  };
  return (
    <React.Fragment>
      <Button onClick={handleShow} block>
        Delete Account
      </Button>
      <Formik initialValues={{ Password: "" }}>
        {({ values }) => (
          <Form>
            <Modal
              show={show}
              onHide={handleClose}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Deleting account</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field
                  type="password"
                  label="Password"
                  name="Password"
                  id="Password"
                  component={ReactstrapInput}
                />
                <p className="text-muted">
                  By deleting your account, your profile, photos, followers and
                  blogs will be permanently removed
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => handleSubmit(values)}
                >
                  Delete account
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default DeleteAccountForm;
