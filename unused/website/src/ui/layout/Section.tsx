import React from "react";

type SectionProps = React.HTMLAttributes<HTMLDivElement>

const Section: React.FC<SectionProps> = ({className, children, ...props}) => {
    return (
        <section className={`container mx-auto px-4 mt-12 ${className}`} {...props}>
            {children}
        </section>
    )
}

export default Section;