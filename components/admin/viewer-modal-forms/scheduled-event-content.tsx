import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { DateTime } from 'luxon';
import { FormViewerContent } from './form-viewer-content';

export const ScheduledEventViewerContent = ({ obj_id }: { obj_id: string }) => {
    const queryClient = useQueryClient();

    const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

    const { isLoading: isEventLoading, error: eventError, data: eventData } = useQuery({
        queryKey: ['event', obj_id],
        queryFn: () => fetch(`/api/events/${obj_id}`).then((res) => res.json()),
    });

    const { isLoading: isNotesLoading, error: notesError, data: notesData } = useQuery({
        queryKey: ['notes', obj_id],
        queryFn: () => fetch(`/api/events/${obj_id}/notes`).then((res) => res.json()),
    });

    //We need to get the user's intake and supplement forms to provide a list underneath the event details
    const { isLoading: isFormsLoading, error: formsError, data: formsData } = useQuery({
        queryKey: ['forms', eventData?.users?.id],
        queryFn: () => eventData?.users?.id ? fetch(`/api/user/${eventData.users.id}/forms`).then((res) => res.json()) : Promise.resolve([]),
        enabled: !!eventData?.users?.id
    });

    const addNoteMutation = useMutation(
        (noteData: { note: string; created_at: string; created_by: string }) => 
            fetch(`/api/events/${obj_id}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(noteData),
            }).then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Failed to add note: ${errorText}`);
                }
                return res.json();
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['notes', obj_id]);
            },
            onError: (error) => {
                console.error('Error adding note:', error);
                // Handle error (e.g., show an error message to the user)
            },
        }
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputRef.current && inputRef.current.value.trim() !== '') {
            addNoteMutation.mutate({ note: inputRef.current.value, created_at: new Date().toISOString(), created_by: 'Current User' });
            inputRef.current.value = '';
        }
    };

    const handleFormClick = (formId: string) => {
        setSelectedFormId(formId);
    };

    const closeModal = () => {
        setSelectedFormId(null);
    };

    if (isEventLoading || isNotesLoading) {
        return <div className='p-4 bg-white rounded-lg shadow-md'>Loading...</div>;
    }

    if (eventError || notesError) {
        return <div className='p-4 bg-white rounded-lg shadow-md'>An error has occurred</div>;
    }

    if (!eventData || eventData.length === 0) {
        return <div className='p-4 bg-white rounded-lg shadow-md'>No events found for this user</div>;
    }

    return (
        <>
        <div className='p-6 '>
            <p className='text-sm font-bold text-gray-900'>Customer Name: <span className='text-gray-600 italic'>{eventData?.users?.full_name || "N/A"}</span></p>
            <p className='text-sm font-bold text-gray-900'>Customer ID: <span className='text-gray-600 italic'>{eventData?.users?.id || "N/A"}</span></p>
            <hr className='my-4 border-gray-300' />
            {Array.isArray(eventData) 
              ? eventData.map((event: any, index: number) => (
                  <div key={index} className='mb-4 border border-gray-300 bg-white rounded-lg shadow-md p-2'>
                      <p className='text-gray-800 font-semibold text-sm'>Event ID: {event?.id || "N/A"}</p>
                      <p className='text-gray-700 text-sm my-2'>Event Start Time: {DateTime.fromISO(event?.start_time).toLocaleString(DateTime.DATETIME_SHORT) || "N/A"}</p>
                  </div>
                ))
              : eventData && (
                  <div className='mb-4 border border-gray-300 bg-white rounded-lg shadow-md p-2'>
                      <p className='text-gray-800 font-semibold text-sm'>Event ID: {eventData?.id || "N/A"}</p>
                      <p className='text-gray-700 text-sm my-2'>Event Start Time: {DateTime.fromISO(eventData?.start_time).toLocaleString(DateTime.DATETIME_SHORT) || "N/A"}</p>
                  </div>
                )
            }
        </div>
        <div className='p-6'>
            <h2 className='text-lg font-bold text-gray-900 mb-4'>Forms</h2>
            <div className='flex flex-col space-y-2'>
                {isFormsLoading ? (
                    <p className='text-sm text-gray-700'>Loading forms...</p>
                ) : formsError ? (
                    <p className='text-sm text-red-600'>Error loading forms</p>
                ) : formsData && formsData.length > 0 ? (
                    formsData.map((form: any, index: number) => (
                        <button 
                            key={index} 
                            onClick={() => handleFormClick(form.id)}
                            className='text-left text-blue-600 hover:text-blue-800 hover:underline'
                        >
                            {form.title}
                        </button>
                    ))
                ) : (
                    <p className='text-sm text-gray-700'>No forms available</p>
                )}
            </div>
        </div>
        <div id='notes-manager-viewer'>
            <div className='p-4 bg-white rounded-lg shadow-md'>
                <h2 className='text-lg font-bold text-gray-900'>Notes Manager</h2>
                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <div className='flex flex-row justify-between'>
                        <input
                            ref={inputRef}
                            type='text'
                            className='w-full p-2 border border-gray-300 rounded-md'
                            placeholder='Enter a new note'
                        />
                        <button type='submit' className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-md'>Save</button>
                    </div>
                    <div className='flex flex-col mt-4'>
                        {notesData && notesData[0]?.decrypted_notes && notesData[0].decrypted_notes.length > 0 ? (
                            notesData[0].decrypted_notes.map((note: any, index: number) => (
                                <div key={index} className='flex flex-row justify-between border-b border-gray-200 py-2'>
                                    <p className='text-md text-gray-900'>{note.decrypted_note}</p>
                                    <p className='text-sm text-gray-700'>{DateTime.fromISO(note.created_at).toLocaleString(DateTime.DATETIME_SHORT)}</p>
                                </div>  
                            ))
                        ) : (
                            <p className='text-sm text-gray-700'>No notes available</p>
                        )}
                    </div>
                </form>
            </div>
        </div>

        {selectedFormId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <button 
                        onClick={closeModal}
                        className="float-right text-gray-600 hover:text-gray-800"
                    >
                        Close
                    </button>
                    <FormViewerContent obj_id={selectedFormId} />
                </div>
            </div>
        )}
    </>
  );
};
