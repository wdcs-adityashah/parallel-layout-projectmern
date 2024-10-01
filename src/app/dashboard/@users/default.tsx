// // src/app/complex-dashboard/@notifications/default.tsx
"use client"
import Notifications from "./page";
import { usePathname } from "next/navigation";
export default function Users() {
  const pathname = usePathname();
  if(pathname === '/dashboard/users') {
    return <div><Notifications/></div>
  }
  else{
    return <div>No data available</div>;
  }
  }
  
//   // Repeat similarly for products, revenue, and users
  