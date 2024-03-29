import React, { useContext } from "react";
import "./display.css";
import { AppContext } from "../../context/AppContext";
const DisplayData = ({ files, cssName }) => {
  const EXTERNAL_FOLDER = process.env.REACT_APP_IMAGES_FOLDER;
  const NumOfFiles = files.length;
  return (
    <div className={`container ${cssName}`}>
      {typeof files === "string" ? (
        <div className="image">
          <img src={EXTERNAL_FOLDER + files} alt="" className="grid-image" />
        </div>
      ) : (
        files?.slice(0, 5).map((file, index) => {
          return (
            <div className="image">
              <img
                src={cssName.includes("post") ? file : URL.createObjectURL(file)}
                alt=""
                className="grid-image"
              />
              <span className="left-over">
                {index == 4 && NumOfFiles > 5 && `+${NumOfFiles - 5}`}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default DisplayData;
