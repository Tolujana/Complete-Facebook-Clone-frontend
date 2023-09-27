import React, { useEffect, useMemo, useState } from "react";
import styles from "./Post.module.css";
import { axiosInstance } from "../../proxySettings";
import { Link } from "react-router-dom";

const ShowComments = ({ userComment }) => {
  const NOIMAGE = process.env.REACT_APP_NO_IMAGE;
  const { userName, userId, userImage, comment, replies } = userComment;
  const [userPics, setUserPics] = useState(userImage);
  // const { user: currentUser, modalType, dispatch } = useContext(AppContext);

  useEffect(() => {
    const getProfilePics = async () => {
      const res = await axiosInstance.get(`users/pics/${userId}`);
      setUserPics(res.data);
    };
    getProfilePics();
  }, []);

  return (
    <div className={styles.previousComment}>
      <Link style={{ textDecoration: "none" }} to={"/profile/" + userName}>
        <img src={userPics || NOIMAGE} alt="" className={styles.postImg} />
      </Link>
      <div className={styles.commentDisplay}>
        <div className={styles.usersText}>
          <div className={styles.commentName}>
            <span>{userName}</span>
          </div>
          <span>{comment}</span>
        </div>
        <div className={styles.commentActionButtons}>
          <span>Like</span>
          <span>Reply</span>
          <span>Share</span>
        </div>
        <div className={styles.replies}>{replies}</div>
      </div>
    </div>
  );
};

export default ShowComments;
