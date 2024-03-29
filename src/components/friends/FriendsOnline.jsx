import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { SingleMessage } from "../messenger/Messenger";
import styles from "./FriendsOnline.module.css";
const Folder = process.env.REACT_APP_IMAGES_FOLDER;
export const FriendsOnline = ({ user }) => {
  //const [chat, setChat] = useState(false);
  const { dispatch, chats, messages } = useContext(AppContext);
  const NOIMAGE = process.env.REACT_APP_NO_IMAGE;
  const handleClick = () => {
    if (
      !chats?.some((users) => users._id === user._id)
      // !chats?.includes(user)
      //|| messages.some((message) => message.receiverId === user._id)
    ) {
      dispatch({ type: "CHAT_START", payload: user });
    }
  };

  return (
    <div onClick={handleClick} className={styles.FriendsOnline}>
      <div>
        <li className={styles.friendsInfo}>
          <div className={styles.profileImgContainer}>
            <img
              src={user.profilePicture ? user.profilePicture : NOIMAGE}
              alt=""
              className={styles.friendsPics}
            />
            <div className={styles.online}></div>
          </div>

          <span className={styles.friendsName}>
            {user?.username?.charAt(0).toUpperCase() + user?.username?.slice(1)}
          </span>
        </li>
      </div>
    </div>
  );
};
