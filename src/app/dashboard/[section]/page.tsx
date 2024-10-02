import React from "react";
import ComplexDashboardLayout from "../layout"; // Adjust path if needed

// Components for each section (could be imported from other files)
const UsersComponent = () => <div>Users Content</div>;
const RevenueComponent = () => <div>Revenue Content</div>;
const NotificationsComponent = () => <div>Notifications Content</div>;
const ProductsComponent = () => <div>Products Content</div>;

export default function SectionPage({ params }: { params: { section: string } }) {
  const { section } = params;

  let sectionContent = null;

  switch (section) {
    case "users":
      sectionContent = <UsersComponent />;
      break;
    case "revenue":
      sectionContent = <RevenueComponent />;
      break;
    case "notifications":
      sectionContent = <NotificationsComponent />;
      break;
    case "products":
      sectionContent = <ProductsComponent />;
      break;
    default:
      sectionContent = <p>Section not found!</p>;
  }

  return (
    <ComplexDashboardLayout 
      users={<UsersComponent />} 
      products={<ProductsComponent />} 
      notifications={<NotificationsComponent />} 
      post={<div>Post Content</div>} // You can define or import your PostComponent
    >
      {sectionContent}
    </ComplexDashboardLayout>
  );
}
