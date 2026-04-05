import React from "react";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({title, className, children, ...props}) => {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    )
}

export default PageHeader;