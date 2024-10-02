"use client";
import React, { useState, useEffect } from "react";
import styles from "./complex-dashboard.module.css";
import DelayedLoader from "@/components/DelayedLoader";

export default function ComplexDashboardLayout({
  children,
  users,
  products,
  notifications,
  post,
}: {
  children: React.ReactNode;
  users: React.ReactNode;
  products: React.ReactNode;
  notifications: React.ReactNode;
  post: React.ReactNode;
}) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [openSections, setOpenSections] = useState({
    users: false,
    post: false,
    notifications: false,
    products: false,
  });

  useEffect(() => {
    const loadSectionsSequentially = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setOpenSections((prev) => ({ ...prev, users: true }));
      setLoadingStep(1);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOpenSections((prev) => ({ ...prev, post: true }));
      setLoadingStep(2);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOpenSections((prev) => ({ ...prev, notifications: true }));
      setLoadingStep(3);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOpenSections((prev) => ({ ...prev, products: true }));
      setLoadingStep(4);
    };

    loadSectionsSequentially();
  }, []);


  return (
    <div className={styles.container}>
      <div className={styles.gridContent}>
        {/* Users section */}
        <div className={styles.gridItem}>
         
         
          {openSections.users && loadingStep > 0 ?(
            <div className={styles.gridItem}>
              <div>
                {users}
              </div>
            </div>
          ):<DelayedLoader /> }
        </div>

        {/* Revenue section */}
        <div className={styles.gridItem}>
       
         
          {openSections.post && loadingStep > 1 ? (
            <div className={styles.gridItem}>
              <div>
                {post}
               
              </div>
            </div>
          ):<DelayedLoader />}
        </div>

        <div className={styles.gridItem}>
         
          {openSections.notifications && loadingStep > 2 ? (
            <div className={styles.gridItem}>
               <div>
                {notifications}
              </div> 
            </div>
          ):<DelayedLoader /> }
        </div>

        <div className={styles.gridItem}>
          
        
          {openSections.products && loadingStep > 3 ? (
            <div className={styles.gridItem}>
              <div>
                {products}
              </div>
            </div>
          ):<DelayedLoader /> }
        </div>
      </div>
    </div>
  );
}
