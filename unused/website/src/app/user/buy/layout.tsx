import React from "react";

const BuyLayout: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({children, ...props}) => {
    return (
        <div className={"min-h-0 h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] px-4 pt-4"} {...props}>
            {children}
        </div>
    );
}

export default BuyLayout;
