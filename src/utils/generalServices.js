import { useState } from "react";

import { axiosInstance } from "../proxySettings";
import axios from "axios";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "./firebase";

const baseURL = "http://localhost:8800/api";
export const openPopupDialog = (action, dispatch) => {
  dispatch(action);
};

export const confirmFriendRequest = async (userId, currentUser, dispatch) => {
  try {
    const res = await axiosInstance.put(`users/${userId}/friend`, {
      userId: currentUser._id,
    });
    if (res.status === 200) {
      dispatch({
        type: "UPDATE_FRIEND",
        payload: { ...currentUser, friends: res.data },
      });
      return true;
    }
  } catch (error) {}
};

export const DeleteFriendRequest = async (userId, currentUser, dispatch) => {
  try {
    const res = await axiosInstance.put(`users/${userId}/cancelrequest`, {
      id: currentUser._id,
    });

    if (res.status === 200) {
      dispatch({
        type: "UPDATE_FRIENDREQUEST",
        payload: { ...currentUser, friendRequest: res.data },
      });
      return true;
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const confirmFriend = (userId, currentUser, dispatch, setButtonText = null) => {
  const isConfirmed = confirmFriendRequest(userId, currentUser, dispatch);

  if (isConfirmed) {
    DeleteFriendRequest(userId, currentUser);
    setButtonText("Friends");
  }
};

export const uploadDatas = async (uri, uploadFiles, newPost = "") => {
  try {
    const response = await axiosInstance.post("/upload", uploadFiles);
    console.log(response);
  } catch (error) {}

  try {
    const res = await axiosInstance.post(`${uri}`, newPost);

    document.location.reload();
  } catch (error) {
    console.log(error);
  }
};

export const uploadData = async (uri, newPost = "") => {
  try {
    const res = await axiosInstance.post(`${uri}`, newPost);
    console.log(res);
    // if (res.status == 200) document.location.reload();
  } catch (error) {
    console.log(error);
  }
};

export const uploadtoServer = async (uri, body = "", method = "put") => {
  const url = baseURL + uri;
  let response;
  try {
    response = makeAPIRequest(url, method, body);

    // window.location.reload();
  } catch (error) {
    response = error.message;
  }
  return response;
};

// export const uploadImages = async (event, uri, uploadFiles, newPost = "", method = "put") => {
//   const url = baseURL + uri;
//   const imageRef = ref(storage, "image");

//   const dropActive = event.type === "drop" ? true : false;
//   const files = dropActive ? event.dataTransfer.files : event.target.files;
//   uploadBytes(imageRef);

//   const [fileNames, data, filesArray, errorMessage] = handleFiles(files, dropActive);
//   console.log(event);
//   setFileNames(fileNames);
//   setUploadFiles(data);
//   setDisplayData(filesArray);
//   setError(errorMessage);

//   let response;
//   try {
//     response = await axiosInstance.post("/upload", uploadFiles);
//   } catch (error) {}

//   try {
//     if (response.status === 200) {
//       const res = makeAPIRequest(url, method, newPost);
//     }

//     window.location.reload();
//   } catch (error) {
//     console.log(error);
//   }
// };

const checkFileIsValid = (files) => {
  const check = !Object.values(files).some((file) => {
    const { type } = file;

    return !/mp4|jpg|jpeg|gif|png/.test(type);
  });
  return check;
};

export const handleFiles = (files, fromDragnDrop = false) => {
  let errorMessage = "";
  if (fromDragnDrop && !checkFileIsValid(files)) {
    errorMessage = "file/file(s)  not an image";
  }

  const data = new FormData();
  const filesArray = Object.values(files);
  let fileNames = [];
  filesArray.forEach((file) => {
    const fileName = Date.now() + file.name;
    fileNames = [...fileNames, fileName];
    data.append("files", file, fileName);
  });

  return [fileNames, data, filesArray, errorMessage];
};

export const processDragNDrop = (event, setDragActive, handleFileUpload = null) => {
  event.preventDefault();
  event.stopPropagation();
  if (event.type === "dragenter" || event.type === "dragover") {
    setDragActive(true);
  } else {
    setDragActive(false);
  }
  if (event.type === "drop") {
    // uploadImages(event);
    handleFileUpload(event, true);
  }
};

const formeruploadmediat = (event, setDragActive, handleFileUpload) => {
  event.preventDefault();
  event.stopPropagation();
  if (event.type === "dragenter" || event.type === "dragover") {
    setDragActive(true);
  } else {
    setDragActive(false);
  }
  if (event.type === "drop") {
    handleFileUpload(event);
  }
};
const makeAPIRequest = async (url, method, data) => {
  const config = {
    method: method,
    url: url,
    data: data,
  };

  return axios(config)
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
export const handleUploadedFiles = async (files, folderName = "files") => {
  let urls = [];
  const numberOfFiles = files.length;

  if (numberOfFiles == 1) {
    await firebaseFileUpload(files[0], urls, folderName);
  } else {
    for (let index = 0; index < numberOfFiles; index++) {
      await firebaseFileUpload(files[index], urls, folderName);
    }
  }

  return [urls, numberOfFiles];
};
export const firebaseFileUpload = async (file, urls, folderName) => {
  const imageRef = ref(storage, `/${folderName}/${file.name}`);
  const result = await uploadBytes(imageRef, file)
    .then(
      await getDownloadURL(imageRef)
        .then((url) => {
          urls.push(url);
        })
        .catch((error) => {
          console.log(error.message, "error getting url");
        })
    )
    .catch((error) => {
      console.log(error.message, "error uploading");
    });
};
