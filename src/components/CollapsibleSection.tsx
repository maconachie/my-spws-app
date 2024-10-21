import React, { ReactNode, useState } from "react";

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Collapse" : "Expand"} {title}
      </button>
      <div className={`content ${isOpen ? "content-open" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection;
