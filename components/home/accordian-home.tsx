"use client";

import * as React from "react";
import * as AccordionPrimitiveHome from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus , faMinus } from "@fortawesome/pro-solid-svg-icons";

const AccordionHome = AccordionPrimitiveHome.Root;

const AccordionItemHome = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitiveHome.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitiveHome.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitiveHome.Item
        ref={ref}
        className={cn("border-b", className)}
        {...props}
    />
));
AccordionItemHome.displayName = "AccordionItem";

const AccordionTriggerHome = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitiveHome.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitiveHome.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitiveHome.Header className="flex">
        <AccordionPrimitiveHome.Trigger
            ref={ref}
            className={cn(
                "text-start flex flex-1 items-center justify-between p-L text-sm font-medium transition-all\ text-[14px] font-bold rounded-sm",
                "[&[data-state=open]>svg]:rotate-45",
                className
            )}
            {...props}
        >
            {children}
            <FontAwesomeIcon
                icon={faPlus}
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
            />
        </AccordionPrimitiveHome.Trigger>
    </AccordionPrimitiveHome.Header>
));
AccordionTriggerHome.displayName = AccordionPrimitiveHome.Trigger.displayName;

const AccordionContentHome = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitiveHome.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitiveHome.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitiveHome.Content
        ref={ref}
        className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
    >
        <div className={cn("p-L", className)}>{children}</div>
    </AccordionPrimitiveHome.Content>
));
AccordionContentHome.displayName = AccordionPrimitiveHome.Content.displayName;

export { AccordionHome, AccordionItemHome, AccordionTriggerHome, AccordionContentHome };
