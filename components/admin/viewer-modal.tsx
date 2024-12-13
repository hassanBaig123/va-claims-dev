'use client';
import React from 'react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '../ui/dialog';
import { useQuery } from 'react-query';
import { Button } from '../ui/button';
import { User } from '@supabase/supabase-js';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { DateTime } from 'luxon';

interface ViewModalProps {
    title: string;
    action: string;
    onAction: () => void;
    secondaryAction?: string;
    onSecondaryAction?: () => void;
    children: React.ReactNode;
}

export const FormViewerContent = ({ obj_id }: { obj_id: string }) => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['form', obj_id],
        queryFn: () => fetch(`/api/form/${obj_id}`, {
            method: 'GET',
        }).then((res) => res.json()),
    });

    if(isLoading) {
        return <div>Loading...</div>;
    }

    if (error) return 'An error has occurred: ' + error;

    // console.log(data);

    const form: any = JSON.parse(data.decrypted_form);
    console.log(form);

    return (
        data && <><div className='p-4'>
            <p className='text-lg font-semibold text-white'>Customer Name: {data.users.full_name}</p>
            <p className='text-lg font-semibold text-white'>Customer ID: {data.users.id}</p>
            <p className='text-sm text-gray-400'>Created At: {data.created_at}</p>
            <p className='text-sm text-gray-400'>Updated At: {data.updated_at}</p>
        </div>

        <div className='space-y-4'>
            {form.questions.map((item, index) => (
                <div key={index} className='p-4 border-b border-gray-600'>
                    <p className='font-bold text-lg mb-2 text-white'>{item.question.label}</p>
                    {item.question.component === "multi-select" && <p className='pl-4 text-gray-300'>{item.answer.options.join(", ")}</p>}
                    {item.question.component === "date-range" && <p className='pl-4 text-gray-300'>{item.answer.startDate} - {item.answer.endDate}</p>}
                    {item.question.component === "radio" && <p className='pl-4 text-gray-300'>{item.answer}</p>}
                    {item.question.component === "dropdown" && <p className='pl-4 text-gray-300'>{item.answer}</p>}
                    {item.question.component === "condition-search" && (
                        <div className='pl-4 space-y-2'>
                            {item.answer.map((condition, idx) => (
                                <div key={idx} className='p-2 border rounded-lg border-gray-600'>
                                    <p className='font-semibold text-white'>{condition.label}</p>
                                    <p className='text-gray-300'>Description: {condition.description}</p>
                                    <p className='text-gray-300'>Current Diagnosis: {condition.details.currentDiagnosis}</p>
                                    <p className='text-gray-300'>Disability Rating: {condition.details.disabilityRating}%</p>
                                    <p className='text-gray-300'>Service Connected: {condition.details.serviceConnected}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
        </>
    );
}

export const ReportViewerContent = ({ obj_id }: { obj_id: string }) => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['reportId', obj_id],
        queryFn: () => fetch(`/api/reports/${obj_id}`, {
            method: 'GET',
        }).then((res) => res.json()),
    });

    if(isLoading) {
        return <div>Loading...</div>;
    }

    if (error) return 'An error has occurred: ' + error;

    console.log(data);

    const report: ResearchReport = JSON.parse(data.decrypted_form);

    return (
        <div>
            <p>Customer Name: {report.users.full_name}</p>
            <p>Customer ID: {report.users[0].id}</p>
            <p>Created At: {report.created_at}</p>
            <p>Updated At: {report.updated_at}</p>
        </div>
    );
}

export const NotesViewerContent = ({ obj_id }: { obj_id: string}) => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['notes', obj_id],
        queryFn: () => fetch(`/api/events/${obj_id}/notes`, {
            method: 'GET',
        }).then((res) => res.json()),
    });

    if(!data) {
        return <div>Event not found</div>;
    }

    return (
        <div>
            <p>Customer Name: {data.users.full_name}</p>
            <p>Customer ID: {data.users.id}</p>
            <Separator />
            { data.decrypted_notes.map((note: any) => (
                <div>
                    <p className='hidden'>Note ID: {note.id}</p>
                    <p>Note: {note.decrypted_note}</p>
                    <p>Created At: {note.created_at}</p>
                </div>
            ))}
        </div>
    );
}

export const ScheduledEventViewerContent = ({ obj_id }: { obj_id: string }) => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['userId', obj_id],
        queryFn: () => fetch(`/api/user/${obj_id}/events`, {
            method: 'GET',
        }).then((res) => res.json()),
    });

    if(isLoading) {
        return <div>Loading...</div>;
    }

    if (error) return 'An error has occurred: ' + error;

    console.log(data);

    if(!data) {
        return <div>Event not found</div>;
    }

    return (
        <div>
            <p>Customer Name: {data[0].users.full_name}</p>
            <p>Customer ID: {data[0].users.id}</p>
            <Separator />
           { data.map((event: any) => (
                <div>
                    <p className='hidden'>Event ID: {event.id}</p>
                    <p>Event Start Time: {DateTime.fromISO(event.start_time).toLocaleString(DateTime.DATETIME_FULL)}</p>
                </div>
            ))}
        </div>
    );
}

export const EmailSentViewerContent = ({ obj_id }: { obj_id: string }) => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['form', obj_id],
        queryFn: () => fetch(`/api/user/${obj_id}`, {
            method: 'GET',
        }).then((res) => res.json()),
    });

    if(isLoading) {
        return <div>Loading...</div>;
    }

    if (error) return 'An error has occurred: ' + error;

    const user: Users = data;

    console.log(user);

    if(!user) {
        return <div>Email not found</div>;
    }

    return (
        <div>
            <p>Customer Name: {user.full_name}</p>
            <p>Customer ID: {user.id}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}

export default function ViewerModal({ title, action, onAction, secondaryAction, onSecondaryAction, children }: ViewModalProps) {
    return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button>{action}</Button>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                    <h2>{title}</h2>
                </DialogHeader>
                <div className='overflow-y-scroll h-[calc(100vh-200px)]'>
                    {children}
                </div>
                <DialogClose asChild><Button onClick={() => { onAction(); }}>{action}</Button></DialogClose>
                {secondaryAction && onSecondaryAction && <DialogClose asChild><Button onClick={() => { onSecondaryAction(); }}>{secondaryAction}</Button></DialogClose>}
                </DialogContent>
            </Dialog>
    )
}