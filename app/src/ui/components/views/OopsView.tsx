import React from "react";
import {FrownIcon} from "lucide-react";

type OopsViewProps = React.HTMLAttributes<HTMLDivElement>;

const OopsView: React.FC<OopsViewProps> = ({className, children, ...props}) => {
    return (
        <div
            className={`w-full h-full rounded-lg pr-4 flex flex-col items-center justify-center gap-4 ${className}`} {...props}>
            <FrownIcon size={72} opacity={0.5}/>
            <span>{children}</span>
        </div>
    )
}

export default OopsView;