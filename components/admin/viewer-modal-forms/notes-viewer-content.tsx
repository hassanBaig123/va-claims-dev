import MemoizedDateConverter from '@/components/date-converter';
import { useQuery } from 'react-query';

export const NotesViewerContent = ({ obj_id }: { obj_id: string }) => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['notes', obj_id],
        queryFn: () => fetch(`/api/events/${obj_id}/notes`).then((res) => res.json()),
    });

    if (isLoading) {
        return <div className='p-4 bg-white rounded-lg shadow-md'>Loading...</div>;
    }

    if (error) {
        return <div className='p-4 bg-white rounded-lg shadow-md'>An error has occurred</div>;
    }

    if (!data) {
        return <div className='p-4 bg-white rounded-lg shadow-md'>Event not found</div>;
    }

    const { users, decrypted_notes } = data;

    return (
        <div className='p-6 '>
            <p className='text-md font-bold text-gray-900'>Customer Name: <span className='text-gray-600 italic'>{users.full_name}</span></p>
            <p className='text-md font-bold text-gray-900'>Customer ID: <span className='text-gray-600 italic'>{users.id}</span></p>
            <hr className='my-4 border-gray-300' />
            {decrypted_notes?.map((note: any, index: number) => (
                <div key={index} className='mb-4 border border-gray-300 bg-white rounded-lg shadow-md p-2'>
                    <p className='text-gray-800 font-semibold text-sm'>Note ID: {note?.id || "N/A"}</p>
                    <p className='text-gray-700 text-sm my-2'>{note?.decrypted_note || "N/A"}</p>
                    <MemoizedDateConverter dateString={note?.created_at || "N/A"} />
                </div>
            ))}
        </div>
    );
};
