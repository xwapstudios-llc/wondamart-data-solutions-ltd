import React from "react";

type PageTitleProps = React.HtmlHTMLAttributes<HTMLHeadingElement>;

const PageTitle: React.FC<PageTitleProps> = ({className, children, ...props}) => {
    return (
        <h1 className={`text-2xl ${className}`} {...props}>
            {children}
        </h1>
    )
}

export default PageTitle;