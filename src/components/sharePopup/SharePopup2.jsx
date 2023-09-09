import React, { useContext, useRef, useState } from "react";
import style from "./sharePopup.module.css";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../proxySettings";
import DisplayData from "../display/DisplayData";
import {
  handleFiles,
  handleUploadedFiles,
  processDragNDrop,
  uploadData,
  uploadtoServer,
} from "../../utils/generalServices";
import { CircularProgress } from "@mui/material";

const PublicFolder = process.env.REACT_APP_IMAGES_FOLDER;
const NOIMAGE = process.env.REACT_APP_NO_IMAGE;
const SharePopup2 = () => {
  const { user } = useContext(AuthContext);
  const [isDragActive, setDragActive] = useState(false);
  const [isDropped, setDropActive] = useState(false);
  const [files, setFile] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userInput = useRef();
  const [displayData, setDisplayData] = useState([]);
  const [firebaseurl, setFireBaseUrl] = useState(null);
  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const [input, setInput] = useState("");
  const designType = ["row", "column"]; //this is for css style
  const randomNumber = Math.floor(Math.random() * 2);
  const classNameOptions = ["one", "two", "three", "four"]; // this is for CSS styles
  const design = designType[randomNumber];

  //this is for post display based on number of images as in Facebook
  const designPattern =
    numberOfFiles < 5
      ? ` ${design} ${classNameOptions[numberOfFiles - 1]} `
      : ` ${design} multiple`;

  const updatePost = async (e) => {
    setIsLoading(true);
    const [url] = await handleUploadedFiles(files, "profiles");
    setIsLoading(false);

    const newPost = {
      userId: user._id,
      desc: userInput?.current?.value,
      files: url,
      cssName: `post ${designPattern}`,
    };
    uploadtoServer(`/posts`, newPost, "post");
    //uploadData("posts", newPost);
  };
  const showdisplayimage = (event) => {
    const dropActive = event.type === "drop" ? true : false;
    const files = dropActive ? event.dataTransfer.files : event.target.files;
    setFile(files);
    const data = new FormData();
    const filesArray = Object.values(files);
    setDisplayData(filesArray);
    setNumberOfFiles(filesArray.length);
  };
  // const handleFileUpload = (event) => {
  //   const dropActive = event.type === "drop" ? true : false;
  //   const files = dropActive ? event.dataTransfer.files : event.target.files;
  //   const [fileNames, data, filesArray, errorMessage] = handleFiles(files, dropActive);
  //   console.log(event);
  //   setFileNames(fileNames);
  //   setUploadFiles(data);
  //   setDisplayData(filesArray);
  //   setError(errorMessage);
  // };

  return (
    <div className={style.shareContainer}>
      <div className={style.title}>Create Post</div>
      <div className={style.shareWrapper}>
        <div className={style.userInfo}>
          <img
            src={!user.profilePicture ? NOIMAGE : PublicFolder + "/" + user.profilePicture}
            alt=""
            className={style.shareImage}
          />
          <div className={style.details}>
            <div className={style.name}>
              {user?.username?.charAt(0).toUpperCase() + user?.username?.slice(1)}
            </div>
            <select name="" id="" className="postType">
              <option value="" selected>
                Public
              </option>
              <option value="">private</option>
            </select>
          </div>
        </div>
        <div className={style.postContent}>
          <div className={style.inputbox}>
            <input
              type="text"
              placeholder={
                "What's on your mind " +
                user?.username?.charAt(0).toUpperCase() +
                user?.username?.slice(1) +
                "?"
              }
              className={style.input}
              // value={input}
              ref={userInput}
              // onchange={setUserInput}
            />
          </div>
          <div className={style.photoUpload}>
            {isDragActive && (
              <div
                className={style.dragElement}
                onDragEnter={(e) => {
                  processDragNDrop(e, setDragActive, showdisplayimage);
                }}
                onDrop={(e) => {
                  processDragNDrop(e, setDragActive, showdisplayimage);
                }}
                onDragOver={(e) => {
                  processDragNDrop(e, setDragActive, showdisplayimage);
                }}
                onDragLeave={(e) => {
                  processDragNDrop(e, setDragActive, showdisplayimage);
                }}
              ></div>
            )}
            {(isDropped || numberOfFiles > 0) &&
              (isLoading ? (
                <div className={style.loader}>
                  <CircularProgress size="35%" />
                </div>
              ) : (
                <div className={style.display}>
                  <DisplayData files={displayData} cssName={designPattern} />
                </div>
              ))}
            {!isDropped && (
              <div
                className={`${style.drag} ${isDragActive ? style.white : ""}`}
                onDragEnter={(e) => {
                  processDragNDrop(e, setDragActive);
                }}
              >
                {numberOfFiles == 0 && (
                  <label className={style.label} htmlFor="fileInput">
                    <span className={style.labelText}>Drag & Drop photos or Click to upload</span>
                  </label>
                )}
                <input
                  type="file"
                  name="files"
                  id="fileInput"
                  accept="image/png, image/gif, image/jpeg,video/mp4"
                  className={style.fileUpload}
                  multiple
                  onChange={showdisplayimage}
                />
              </div>
            )}
          </div>
        </div>
        <div className={style.actionButtons}></div>
        <button
          className={style.post}
          onClick={(e) => {
            updatePost(e);
          }}
        >
          {" "}
          Post{" "}
        </button>
      </div>
    </div>
  );
};

export default SharePopup2;
