"use client";

import React from "react";
import {useMediaQuery} from "react-responsive";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/cn/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTrigger
} from "@/cn/components/ui/drawer";

interface DrawerDialogProps {
    children?: React.ReactNode;
    trigger: React.ReactNode;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const DrawerDialog: React.FC<DrawerDialogProps> = ({children, trigger, title, description, footer, open, onOpenChange}) => {
    const isDesktop = useMediaQuery({minWidth: 768})

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
                <DialogContent className={"!p-4"}>
                    <DialogHeader>
                        {
                            title && <DialogTitle>{title}</DialogTitle>
                        }
                        {
                            description && <DialogDescription>
                                {description}
                            </DialogDescription>
                        }
                    </DialogHeader>
                    {children}
                </DialogContent>
                {
                    footer && <DialogFooter className={"pt-2"}>
                        {footer}
                    </DialogFooter>
                }
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>
                {trigger}
            </DrawerTrigger>
            <DrawerContent className={"px-4 pb-4"}>
                <DrawerHeader className="text-left">
                    {
                        title && <DialogTitle>{title}</DialogTitle>
                    }
                    {
                        description && <DrawerDescription>
                            {description}
                        </DrawerDescription>
                    }
                </DrawerHeader>
                {children}
                {
                    footer && <DrawerFooter className="pt-2">
                        {footer}
                        {/*<DrawerClose asChild>*/}
                        {/*    <Button variant="outline">Cancel</Button>*/}
                        {/*</DrawerClose>*/}
                    </DrawerFooter>
                }
            </DrawerContent>
        </Drawer>
    )
}

export default DrawerDialog;
