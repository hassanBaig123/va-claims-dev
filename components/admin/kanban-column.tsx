'use client'

import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { changeFormStatus } from "@/utils/data/forms/updateFormStatus";
import Link from "next/link";
import { DateTime } from "luxon";
import ViewerModal, { EmailSentViewerContent, FormViewerContent, NotesViewerContent, ReportViewerContent, ScheduledEventViewerContent } from "./viewer-modal";

const handleEmailClick = ({customer_id}: {customer_id: string}) => {
    emailCustomer(customer_id);
  };

const handleViewClick = ({customer_id}: {customer_id: string}) => {
    viewCustomer(customer_id);
};

const viewCustomer = (customer_id: string) => {
    console.log(`Viewing customer ${customer_id}`);
};

const approveForm = (form_id: string) => {
    console.log(`Approving form ${form_id}`);
    const status: FormsStatus = "submission_approved";
    const result = fetch(`/api/form/${form_id}/status`, {
        method: "PUT",
        body: JSON.stringify({
            form_id: form_id,
            status: status,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
};

const approveReport = (form_id: string) => {
    console.log(`Approving form ${form_id}`);
    const status: FormsStatus = "submission_approved";
    const result = fetch("/api/updateReportStatus", {
        method: "PUT",
        body: JSON.stringify({
            form_id: form_id,
            status: status,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
};

const approveNotes = (event_id: string) => {
    console.log(`Approving form ${event_id}`);
    const status: FormsStatus = "submission_approved";
    const result = fetch(`/api/events/${event_id}`, {
        method: "PUT",
        body: JSON.stringify({
            eventId: event_id,
            status: status,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
};

const sendReminder = (userId: string) => {
    console.log(`Sending reminder for user ${userId}`);
    const result = fetch("/api/sendReminder", {
        method: "POST",
        body: JSON.stringify({
            user_id: userId,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
};

export const IntakesNotCompletedCard = ({item}: {item: any}) => {
    return (
      <CustomCard item={item}>
        <ViewerModal title={item.users.full_name} action="Email" onAction={() => handleEmailClick({customer_id: item.users.id})}>
            <EmailSentViewerContent obj_id={item.users.id} />
        </ViewerModal>
      </CustomCard>
    );
};

export const IntakesSubmittedCard = ({item}: {item: any}) => {
    return (
        <CustomCard item={item}>
            <ViewerModal title={item.users.full_name} action="View/Approve" onAction={() => approveForm(item.id || "")}>
                <FormViewerContent obj_id={item.id} />
            </ViewerModal>
        </CustomCard>
    );
};

export const SupplementalsNotCompletedCard = ({item}: {item: any}) => {
    return (
        <CustomCard item={item}>
        <ViewerModal title={item.users.full_name} action="Email" onAction={() => handleEmailClick({customer_id: item.users.id})}>
            <EmailSentViewerContent obj_id={item.users.id} />
        </ViewerModal>
      </CustomCard>
    );
};

export const SupplementalsNeedingApprovalCard = ({item}: {item: any}) => {
    return (
        <CustomCard item={item}>
            <ViewerModal title={item.users.full_name} action="View/Approve" onAction={() => approveForm(item.id || "")}>
                <FormViewerContent obj_id={item.id} />
            </ViewerModal>
        </CustomCard>
    );
};

export const DiscoveryNotScheduledCard = ({item}: {item: any}) => {
    return (
        <CustomCard item={item}>
            <ViewerModal title={item.users.full_name} action="Email" onAction={() => handleEmailClick({customer_id: item.users.id})}>
                <FormViewerContent obj_id={item.id} />
            </ViewerModal>
        </CustomCard>
    );
};

export const DiscoveryScheduledCard = ({item}: {item: any}) => {
    return (
        <CustomCard item={item}>
        <ViewerModal title={item.users.full_name} action="Approve" onAction={() => approveForm(item.id || "")}>
            <ScheduledEventViewerContent obj_id={item.users.id} />
        </ViewerModal>
      </CustomCard>
    );
};

export const DiscoveryWithoutNotesCard = ({item}: {item: any}) => {
    return (
        <CustomCard item={item}>
        <ViewerModal title={item.users.full_name} action="Remind" onAction={() => sendReminder(item.id || "")}>
            <ScheduledEventViewerContent obj_id={item.id} />
        </ViewerModal>
      </CustomCard>
    );
};

export const DiscoverySubmittedCard = ({item}: {item: any}) => {
    return (
        <CustomCard item={item}>
        <ViewerModal title={item.users.full_name} action="Approve" onAction={() => approveNotes(item.id || "")}>
            <NotesViewerContent obj_id={item.id} />
        </ViewerModal>
      </CustomCard>
    );
};

export const ReportsNeedingApprovalCard = ({item}: {item: any}) => {
    return (
        <CustomCard item={item}>
        <ViewerModal title={item.users.full_name} action="Remind" onAction={() => approveReport(item.id || "")}>
            <ReportViewerContent obj_id={item.id} />
        </ViewerModal>
      </CustomCard>
    );
};

interface KanbanColumnProps {
    data: any;
    title: string;
    cardComponent: React.FC<CustomCardProps>;
}

interface CustomCardProps {
    item: any;
    children?: ReactNode;
}


//Line 254-273 Update code with the example below
export const KanbanColumn = ({data, title, cardComponent}: KanbanColumnProps) => {
    const CardComponent = cardComponent;
    //Sort the data by updated_at in descending order
    data.sort((a: any, b: any) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
    return (
        <div className="min-w-[300px]">
            <h3 className="flex text-sm font-semibold justify-center">{title}</h3>
            <Separator className="my-2" />
            {data.map((item: any, index: any) => (
            <CardComponent key={index} item={item} />
            ))}
        </div>
    );
};

const CustomCard = ({ item, children }: CustomCardProps) => {
    return (
        <Card className="m-2">
            <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                <div className="text-blue-500 hover:underline cursor-pointer" onClick={() => viewCustomer(item.users.id)}>{item.users.full_name}</div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter>
                {item.created_at && item.updated_at && <div className="flex flex-row justify-between gap-4 w-full">
                    <div className="text-sm text-gray-500 basis-1/2">Created: <br/><span className="text-xs">{DateTime.fromISO(item.created_at).toLocaleString(DateTime.DATE_SHORT)}</span></div>
                    <div className="text-sm text-gray-500 basis-1/2">Updated: <br/><span className="text-xs">{DateTime.fromISO(item.updated_at).toLocaleString(DateTime.DATE_SHORT)}</span></div>
                </div>
                }
            </CardFooter>
        </Card>
    );
}

const emailCustomer = (customer_id: string) => {
    console.log(`Emailing customer ${customer_id}`);
};
