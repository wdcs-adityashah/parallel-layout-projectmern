// 'use client';

// import { useState } from 'react';
// import Button from '@/components/button';
// import DelayedLoader from '@/components/DelayedLoader';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import styles from '../@notifications/notification.module.css'


// export default function NotificationButton() {
//   const [loading, setLoading] = useState(false);
//   const [userCount, setUserCount] = useState<number | null>(null); // Track the post count

//   const router = useRouter();
//  const fetchUserCount = async () => {
//   setLoading(true);
//   try {
//     const response = await axios.get('http://localhost:3010/userCount');
//     setUserCount(response.data.count);
//   } catch (error) {
//     console.error('Error fetching post count:', error);
//     setUserCount(null); 
//   }
//  }
//   const navigateToNotifications = (section: "post" | "users" | "notifications" | "products") => {
//     fetchUserCount();
//     router.push(`/complex-dashboard/${section}`);

//     setLoading(true); 
//     setTimeout(() => {
//       setLoading(false); 
//     }, 1000);
//   };

//   return (
//     <>
//          <div className={styles.loaderButtonWrapper}>
//       {loading ? (
//         <DelayedLoader />
//       ) : (
//         <Button onClick={()=>navigateToNotifications('users')}>
//           Check Users
//         </Button>
//       )}
//       </div>
//       {userCount !== null && (
//         <p>User Count: {userCount}</p>
//       )}
//     </>
//   );
// }
