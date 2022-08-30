import React from "react";
import styles from "./loadingSpinner.module.css";

export default function LoadingSpinner() {
    return (
        <div className="spinner-container">
            <div className={styles.loadingSpinner}>
            </div>
        </div>
    );
}