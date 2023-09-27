import style from "./Messenger.module.css";
import { VideoCall, MoreVert, Create } from "@mui/icons-material";

import { FriendsOnline } from "../friends/FriendsOnline";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import SingleMessage from "../singlemessage/SingleMessage";
import { formLabelClasses } from "@mui/material";
import { axiosInstance } from "../../proxySettings";
const Messenger = ({ show, users }) => {
  const { user, chats, dispatch } = useContext(AppContext);
  const PF = process.env.REACT_APP_IMAGES_FOLDER;

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axiosInstance.get("/users/friend/" + user._id);
        setFriends(res.data);
      } catch (error) {}
    };
    fetchFriends();
  }, [user._id]);

  return (
    <div className={style.messenger}>
      <div className={show ? style.messengerContent : style.none}>
        <div className={style.top}>
          <span className={style.title}>Chat</span>
          <div className={style.icons}>
            <VideoCall /> <MoreVert /> <Create />
          </div>
        </div>
        <input placeholder="Search Messenger" className={style.searchInput} />

        <ul className={style.friendsList}>
          {friends?.map((u, id) => (
            <FriendsOnline key={id} user={u} value={u} className={style.friendsOnline} />
          ))}
        </ul>
      </div>

      <div className={chats?.length > 0 ? style.chatlist : style.none}>
        <ul className={chats?.length > 0 ? style.chats : style.none}>
          {chats?.slice(0, 3).map((user) => (
            <li className={style.chat}>
              <SingleMessage key={user._id} user={user} />
            </li>
          ))}
        </ul>
        <div className={style.remainingChats}>
          {chats?.slice(3).map((user) => (
            <div
              className={style.remainingChat}
              key={user._id}
              style={{
                backgroundSize: "contain",
                backgroundImage: `url(${PF + "/" + user.profilePicture})`,
              }}
            >
              {user.username?.charAt(0).toUpperCase() + user.username?.slice(1)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messenger;
