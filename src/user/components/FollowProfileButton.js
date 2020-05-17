import React from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";

const FollowProfileButton = (props) => {
  const follow = async (username, auth) => {
    try {
      const { data } = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URI}/users/follow/${username}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return await data;
    } catch (error) {
      error.response
        ? toast.error(error.response.data.message)
        : toast.error("Something went wrong. Please try again.");
      return false;
    }
  };

  const unfollow = async (username, auth) => {
    try {
      const { data } = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URI}/users/unfollow/${username}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return await data;
    } catch (error) {
      error.response
        ? toast.error(error.response.data.message)
        : toast.error("Something went wrong. Please try again.");
      return false;
    }
  };

  const followClick = () => {
    props.onButtonClick(follow);
  };

  const unfollowClick = () => {
    props.onButtonClick(unfollow);
  };

  return props.following ? (
    <Button variant="warning" onClick={unfollowClick} block>
      Unfollow
    </Button>
  ) : (
    <Button variant="success" onClick={followClick} block>
      Follow
    </Button>
  );
};

export default FollowProfileButton;
