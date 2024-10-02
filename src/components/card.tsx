const Card = ({ children }: { children: React.ReactNode }) => {
  const cardStyle: React.CSSProperties = {
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    border: "1px solid #ddd",
    display: "flex",
    height: "calc(100vh - 500px)", // Adjust height as needed to fit within viewport
    justifyContent: "left",
    alignItems: "flex-start", // Align content to the top
    flexDirection: "column", // Ensure vertical stacking of children
    overflow: "hidden", // Prevent the entire card from scrolling
  };

  return <div style={cardStyle}>{children}</div>;
};

export default Card;
