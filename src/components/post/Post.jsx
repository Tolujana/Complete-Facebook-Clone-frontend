import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Post.module.css";
import PublicIcon from "@mui/icons-material/Public";
import MoreMenu from "../moreMenu/MoreMenu";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReplyIcon from "@mui/icons-material/Reply";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { axiosInstance } from "../../proxySettings";
import DisplayData from "../display/DisplayData";
import { openPopupDialog } from "../../utils/generalServices";
import ShowComments from "./ShowComments";

const NOIMAGE = process.env.REACT_APP_NO_IMAGE;

const Post = ({ post, commentList }) => {
  const [likes, setLike] = useState(post.likes.length);
  const [commentCount, setCommentCount] = useState(post.comment.length);
  const [userComment, setUserComment] = useState("");
  const [postComments, setPostComments] = useState(post.comment);
  const [updatedComment, setUpdatedComment] = useState([]);
  const textArea = useRef();
  const commentArea = useRef();
  const textBox = useRef();
  const [isLiked, setisLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser, modalType, dispatch } = useContext(AppContext);
  const nameInUpperCase = user?.username?.charAt(0).toUpperCase() + user.username?.slice(1);
  const action = {
    type: "MODAL_TYPE",
    payload: { name: "comment", post: post, user: nameInUpperCase, commentList: postComments },
  };

  const EXTERNAL_FOLDER = process.env.REACT_APP_IMAGES_FOLDER;
  const postComment = (event) => {
    const content = event.target.value;
    const pattern = new RegExp("[^ ]");
    const alpanumericTest = pattern.test(content);
    if (event.key === "Enter" && alpanumericTest) {
      event.preventDefault();
      console.log(content);
      // setUserComment(content);
      //setCommentCount((previous) => previous++);

      event.target.value = "";
      const commentUpdate = {
        userId: currentUser._id,
        comment: content,
        userImage: currentUser.profilePicture,
      };
      setUserComment(commentUpdate);
      setPostComments((previous) => [...previous, commentUpdate]);
      setCommentCount(postComments.length);
      setUpdatedComment((previous) => [...previous, commentUpdate]);
    }
  };

  const updateComment = (comment) => {
    const commentPayload = {
      comment: updatedComment,
    };
    console.log("uploading", updatedComment);
    try {
      const res = axiosInstance.put(`/posts/${post._id}/comment`, commentPayload);
      if (res.status == 200) {
        console.log(res.data);
        setUpdatedComment([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  function autoResize() {
    textArea.current.style.height = "";
    textArea.current.style.height = textArea.current.scrollHeight + "px";
    commentArea.current.style.minHeight = "";
    commentArea.current.style.minHeight = textArea.current.scrollHeight + 10 + "px";
    textBox.current.style.minHeight = "";
    textBox.current.style.minHeight = textArea.current.scrollHeight + 10 + "px";
  }

  const openCommentDialog = () => {
    openPopupDialog(action, dispatch);
  };

  useEffect(() => {
    setisLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  // useEffect(() => {
  //   if (userComment != "") {
  //     const commentUpdate = {
  //       userId: currentUser._id,
  //       comment: userComment,
  //       userImage: currentUser.profilePicture,
  //     };
  //     // setPostComments((previous) => [...previous, commentUpdate]);
  //     // setCommentCount(postComments.length);
  //   }
  // }, [currentUser._id, userComment]);

  const likeHandler = () => {
    try {
      const res = axiosInstance.put(`/posts/${post._id}/like`, {
        userId: currentUser._id,
      });
    } catch (error) {
      if (isLiked) {
        setLike(likes - 1);
        setisLiked(!isLiked);
      } else {
        setLike(likes + 1);
        setisLiked(isLiked);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  return (
    <div className={styles.post}>
      <div className={styles.postWrapper}>
        <div className={styles.postTop}>
          <Link to={`/profile/${user.username}`}>
            <img src={user.profilePicture || NOIMAGE} alt="" className={styles.postImg} />
          </Link>
          <div className={styles.postDetail}>
            <span className={styles.postName}>{"" && nameInUpperCase}</span>
            <div className={styles.time}>
              <span className={styles.timeStamp}>{format(post.createdAt)}</span>
              <span className={styles.timeStampDot}>.</span>
              <PublicIcon className={styles.timeIcon} />
            </div>
          </div>

          <MoreMenu />
        </div>
        <div className={styles.postMiddle}>
          <span className={styles.postText}>{post?.desc}</span>
          <div className={styles.postMedia}>
            {post.files ? (
              <DisplayData files={post.files} cssName={post?.cssName} />
            ) : (
              <img src={post.img} alt="" className={styles.postContentImg} />
            )}
          </div>
        </div>
        <div className={styles.postBottom}>
          <div className={styles.postBottomStats}>
            <div className={styles.likes}>
              <img className={styles.postLike} src={EXTERNAL_FOLDER + "/likes.png"} alt="" />
              <span className={styles.likesCounter}>{likes}</span>
            </div>
            <div className={styles.counters}>
              <span className={styles.commentCounter}>{commentCount} Comments</span>
              <span className={styles.shareCounter}> Shares</span>
            </div>
          </div>

          <div className={styles.postActions}>
            <div className={styles.postBottomAction}>
              <ThumbUpIcon />
              <div onClick={likeHandler} className={styles.like} id="">
                {isLiked ? "Unlike" : "Like"}
              </div>
            </div>
            <div className={styles.postBottomAction} onClick={openCommentDialog}>
              <ChatBubbleOutlineIcon />
              <div className={styles.comment} id="">
                Comments
              </div>
            </div>
            <div className={styles.postBottomAction}>
              <ReplyIcon />
              <div className={styles.share} id="">
                Share
              </div>
            </div>
          </div>

          <div className={styles.postBottomcomments} ref={commentArea}>
            <div className={styles.listOfComments}>
              <ShowComments userComment={userComment} />
            </div>
            <div className={styles.commentField}>
              <div className={styles.postImage}>
                <img
                  src={currentUser.profilePicture || NOIMAGE}
                  alt=""
                  className={styles.postImg}
                />
              </div>
              <div className={styles.textBox} ref={textBox}>
                <textarea
                  onKeyDown={postComment}
                  onBlur={updateComment}
                  onInput={autoResize}
                  ref={textArea}
                  type="text"
                  rows="1"
                  className={styles.commentTextArea}
                  placeholder="Write a comment.."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
