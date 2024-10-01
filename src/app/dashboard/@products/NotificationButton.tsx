'use client';

import { useState } from 'react';
import Button from '@/components/button';
import DelayedLoader from '@/components/DelayedLoader';
import { useRouter } from 'next/navigation';
import styles from '../@notifications/notification.module.css'



export default function NotificationButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [counters, setCounters] = useState({
    users: 0,
    post: 0,
    notifications: 0,
    products: 0,
  });
  const navigateToNotifications = (section: "post" | "users" | "notifications" | "products") => {
    setCounters((prev) => ({
      ...prev,
      [section]: prev[section] + 1,
    }));
    router.push(`/complex-dashboard/${section}`);

    setLoading(true); 
    setTimeout(() => {
      setLoading(false); 
    }, 1000);
  };

  return (
    <>
         <div className={styles.loaderButtonWrapper}>

      {loading ? (
        <DelayedLoader />
      ) : (
        <Button onClick={()=>navigateToNotifications('products')}>
          Check Products
        </Button>
      )}
      </div>
       <p>Products Counter: {counters.products}</p>
    </>
  );
}
