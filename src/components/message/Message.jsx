import React from "react";

import { format } from "timeago.js";
import style from "./message.module.css";
const PF = process.env.REACT_APP_IMAGES_FOLDER;
const NOIMAGE = process.env.REACT_APP_NO_IMAGE;

const Message = ({ message, img, createdAt, owner, ref }) => {
  ref && ref.current.scrollIntoView();
  return owner ? (
    <div className={style.own} ref={ref}>
      <div className={style.messageTopOwn}>
        <p className={style.messageTextOwn}>{message}</p>
        <img className={style.messageImg} src={img ? img : NOIMAGE} alt="" />
      </div>
      <div className={style.messageBottomOwn}> {format(createdAt)}</div>
    </div>
  ) : (
    <div className={style.other}>
      <div className={style.messageTop}>
        <img className={style.messageImg} src={img ? img : NOIMAGE} alt="" />
        <p className={style.messageText}>{message}</p>
      </div>
      <div className={style.messageBottom}>{format(createdAt)}</div>
    </div>
  );
};

export default Message;
