import React, { useState, useEffect } from "react";
import SignupComponent from "../components/SignUpComponent";
import SignInComponent from "../components/SignInComponent";

const Auth = ({ match }) => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  useEffect(
    () => 
      match.path === "/signIn" ? setIsLoginMode(true) : setIsLoginMode(false),
    [match.path]
  );
  return (
    <div className="container-fluid mt-3">
      <h2 className="text-center pt-4 pb-4">
        {isLoginMode ? "SIGN IN" : "SIGN UP"}
      </h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {isLoginMode ? <SignInComponent /> : <SignupComponent />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
