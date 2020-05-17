import React from "react";
import ContactForm from "../user/components/ContactForm";

const Contact = () => {
  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-md-8 offset-md-2">
          <h2>Contact form</h2>
          <hr />
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
