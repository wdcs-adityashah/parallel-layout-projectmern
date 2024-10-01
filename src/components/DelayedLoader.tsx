// components/DelayedLoader.tsx
import React from "react";
import styles from "./DelayedLoader.module.css";

const DelayedLoader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
};

export default DelayedLoader;
