import React, { useContext, useState } from "react";
import styles from "./storyeditor.module.css";
import Topmenu from "../topmenu/topmenu";
import {
  handleFiles,
  handleUploadedFiles,
  processDragNDrop,
  uploadtoServer,
} from "../../utils/generalServices";
import { AuthContext } from "../../context/AuthContext";
import { LinearProgress } from "@mui/material";

const StoryEditor = () => {
  const [isDragActive, setDragActive] = useState(false);
  const [uploadData, setUPloadData] = useState(null);
  const [files, setFiles] = useState("");
  const { user } = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(false);
  const handleFileUpload = (event) => {
    const dropActive = event.type === "drop" ? true : false;
    const files = dropActive ? event.dataTransfer.files : event.target.files;
    const [fileNames, data, filesArray, errorMessage] = handleFiles(files, dropActive);

    setFiles(files);
    setDragActive(true);
    setUPloadData(filesArray);
  };

  const uploadStory = async () => {
    setisLoading(true);
    const [firebaseUrl] = await handleUploadedFiles(files, "stories");
    setisLoading(false);
    const newStory = {
      userId: user._id,
      file: firebaseUrl[0],
    };

    uploadtoServer("/users/story", newStory);
  };
  return (
    <>
      <Topmenu />
      <div className={styles.storyEditor}>
        {}
        <div className={styles.leftmenu}>
          <div className={styles.bottom}>
            <h1 className={styles.title}>Your Story</h1>
            <div className={styles.profileImage}></div>
          </div>
          {isDragActive && (
            <div className={styles.createStory}>
              <button className={styles.discard}>Discard</button>
              {!isLoading && (
                <button onClick={uploadStory} className={styles.shareStory}>
                  Share to Story
                </button>
              )}
            </div>
          )}
        </div>
        <div className={styles.outerContainer}>
          {!isDragActive ? (
            <div className={styles.maincontent}>
              <input
                type="file"
                name="files"
                hidden
                id="fileInput"
                accept="image/png, image/gif, image/jpeg,video/mp4"
                className={styles.fileUpload}
                onChange={handleFileUpload}
              />
              <label
                htmlFor="fileInput"
                className={styles.uploadimage}
                onDrop={(e) => {
                  setDragActive(true);
                  processDragNDrop(e, setDragActive, handleFileUpload);
                }}
                onDragEnter={(e) => {
                  processDragNDrop(e, setDragActive, handleFileUpload);
                }}
                onDragOver={(e) => {
                  processDragNDrop(e, setDragActive, handleFileUpload);
                }}
                onDragLeave={(e) => {
                  processDragNDrop(e, setDragActive, handleFileUpload);
                }}
              >
                <div> Create a Photo story</div>
              </label>
              <div className={styles.addtext}>Create a Text Story</div>
            </div>
          ) : (
            <div className={styles.story}>
              <div className={styles.storyImageContainer}>
                {!isLoading && (
                  <LinearProgress
                    size="20%"
                    style={{ position: "absolute", top: "50%", bottom: "50%" }}
                  />
                )}
                <img
                  src={URL.createObjectURL(uploadData[0])}
                  alt=""
                  className={styles.storyImage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StoryEditor;
