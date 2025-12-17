"use client";

import React from "react";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

interface NavProgressProps {
    children: React.ReactNode
}
const NavProgress: React.FC<NavProgressProps> = ({children}) => {

    return (
        <>
            {children}
            <ProgressBar
                height="4px"
                color="#ffffff"
                options={{ showSpinner: true }}
                shallowRouting
            />
        </>
    );
};

export default NavProgress;
