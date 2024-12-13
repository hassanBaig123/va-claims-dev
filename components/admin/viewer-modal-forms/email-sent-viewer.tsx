import { useQuery } from 'react-query';

interface Users {
    id: string;
    full_name: string;
    email: string;
}

export const EmailSentViewerContent = ({ obj_id }: { obj_id: string }) => {
    const { isLoading, error, data } = useQuery<Users>({
        queryKey: ['user', obj_id],
        queryFn: () => fetch(`/api/user/${obj_id}`).then((res) => res.json()),
    });
    
    if (isLoading) {
        return <div className='p-4 bg-white rounded-lg shadow-md'>Loading...</div>;
    }

    if (error) {
        return <div className='p-4 bg-white rounded-lg shadow-md'>An error has occurred</div>;
    }

    if (!data) {
        return <div className='p-4 bg-white rounded-lg shadow-md'>Email not found</div>;
    }

    const { id, full_name, email } = data;

    return (

        <div className='p-6 bg-white rounded-lg shadow-lg'>
            <p className='text-sm font-bold text-gray-900'>Customer Name: <span className='text-gray-600 italic'>{full_name}</span></p>
            <p className='text-sm font-bold text-gray-900'>Customer ID: <span className='text-gray-600 italic'>{id}</span></p>
            <p className='text-sm font-bold text-gray-900'>Email: <span className='text-gray-600 italic'>{email}</span></p>
        </div>

    );
};
