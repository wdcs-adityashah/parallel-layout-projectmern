// src/app/complex-dashboard/@notifications/default.tsx
"use client"
import Notifications from "../@post/page";
import { usePathname } from 'next/navigation'

export default function Posts() {
  const pathname = usePathname();
  if (pathname === '/dashboard/products') {
    return <div><Notifications/></div>;
  } else {
    return <div>No data available</div>;
  }
  }
  
  // Repeat similarly for products, revenue, and users
  