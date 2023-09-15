import styles from "./Home.module.css";

import Topmenu from "../../components/topmenu/topmenu";
import Leftbar from "../../components/leftbar/Leftbar";
import Content from "../../components/content/Content";
import Rightbar from "../../components/rightbar/Rightbar";
import Share from "../../components/share/Share";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Modal from "../../components/modals/Modal";

export default function Home() {
  const { user } = useContext(AppContext);

  return (
    <div>
      <Topmenu />
      <div className={styles.content}>
        <Leftbar />
        <Content />
        <Rightbar />
      </div>
    </div>
  );
}
