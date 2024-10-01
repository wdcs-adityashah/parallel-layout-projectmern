"use client"
import Notifications from "./page";
import { usePathname } from 'next/navigation'

export default function NotificationWrapper() {
  const pathname = usePathname();
  // Check the current route pathname
  if (pathname === '/dashboard/notifications') {
    return <div><Notifications/></div>;
  } else {
    return <div>No data available</div>;
  }
}
