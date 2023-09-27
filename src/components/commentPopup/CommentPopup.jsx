import React, { useEffect, useState } from "react";
import PostInComment from "../post/PostInComment";
import styles from "./commentPopup.module.css";
import Post from "../post/Post";
import axios from "axios";
import { axiosInstance } from "../../proxySettings";

const CommentPopup = ({ post_id, post: postdata, user, commentList }) => {
  const [post, setPost] = useState(null);
  useEffect(() => {
    let source = axios.CancelToken.source();
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/posts/${post_id}`, { cancelToken: source.token });

        if (res.status === 200) {
          setPost(res.data);
        }
      } catch (error) {}
    };
    fetchPost();
    return () => {
      source.cancel("Cancelling in cleanup");
    };
  }, []);

  return (
    <div className={styles.commentContainer}>
      <div className={styles.title}>{`${user}'s Post`}</div>
      {post && <Post className={styles.post} post={post} commentList={commentList} key={post_id} />}
    </div>
  );
};

export default CommentPopup;
