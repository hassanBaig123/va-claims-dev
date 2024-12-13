import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { DateTime } from 'luxon';

interface FormInterface {
    id: string;
    questions: Array<any>;
    status: string;

}


export const FormViewerContent = ({ obj_id }: { obj_id: string }) => {
    const { isLoading, error, data } = useQuery<any>({
        queryKey: ['form', obj_id],
        queryFn: () => fetch(`/api/form/${obj_id}`).then((res) => res.json()),
    });

    const form: FormInterface = useMemo(() => {
        if (data?.decrypted_form) {
            return JSON.parse(data.decrypted_form);
        }
        return { questions: [] };
    }, [data?.decrypted_form]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>An error has occurred</div>;
    }

    return (
        <div className='bg-white rounded-lg md:shadow-md md:p-6'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>{data?.title || "Form Details"}</h1>
            <div className='mb-6'>
                <p className='text-lg font-bold text-gray-900'>Customer Name: <span className='text-gray-500 text-lg'>{data?.users?.full_name || "N/A"}</span></p>
                <p className='text-lg font-bold text-gray-900'>Customer ID: <span className='text-gray-500 text-sm'>{data?.users?.id || "N/A"}</span></p>
                <p className='text-lg font-bold text-gray-900'>Created At: <span className='text-gray-500 text-sm'>
                    {DateTime.fromISO(data?.created_at).toLocaleString(DateTime.DATE_FULL) || "N/A"}</span></p>
                <p className='text-lg font-bold text-gray-900'>Status: <span className='text-gray-500 text-sm'>{data?.status || "N/A"}</span></p>
                <p className='text-lg font-bold text-gray-900'>Updated At: <span className='text-gray-500 text-sm'>
                    {DateTime.fromISO(data?.updated_at).toLocaleString(DateTime.DATE_FULL) || "N/A"}</span>
                </p>
            </div>
            <div className='space-y-6'>
                {form.questions && form.questions.map((item, index) => (
                    <MemoizedFormItem key={index} item={item} />
                ))}
            </div>
        </div>
    );
};

const MemoizedFormItem = React.memo(({ item }: { item: { question: { label: string; component: string }; answer?: any } }) => {

    return (
        <>
        {item.question && (
            <div className='p-2 bg-gray-100 rounded-lg shadow-sm'>
                <p className='font-bold text-sm text-gray-800 mb-4'>{item.question.label}</p>
                {item.question.component === "multi-select" && (
                    <p className='text-gray-600'>
                        {Array.isArray(item.answer) ? item.answer.join(", ") : item.answer}
                    </p>
                )}
                {item.question.component === "date-range" && (
                    <p className='text-gray-600'>{item.answer?.startDate} - {item.answer?.endDate}</p>
                )}
                {item.question.component === "radio" && (
                    <p className='text-gray-600'>{item.answer}</p>
                )}
                {item.question.component === "dropdown" && (
                    <p className='text-gray-600'>{item.answer}</p>
                )}
                {item.question.component === "text-area" && (
                    <p className='text-gray-600'>{item.answer}</p>
                )}
                {item.question.component === "condition-search" && (
                    <div className='space-y-4'>
                        {item.answer && item.answer.map((condition: any, idx: number) => (
                            <div key={idx} className='p-4 bg-white rounded-lg border border-gray-300 shadow-sm'>
                                <p className='font-semibold text-gray-800'>{condition.label || "N/A"}</p>
                                <p className='text-gray-600'>Description: {condition.description || "N/A"}</p>
                                <p className='text-gray-600'>Current Diagnosis: {condition.details?.currentDiagnosis || "N/A"}</p>
                                <p className='text-gray-600'>Disability Rating: {condition.details?.disabilityRating || "N/A"}%</p>
                                <p className='text-gray-600'>Service Connected: {condition.details?.serviceConnected ? "Yes" : "No"}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
        </>
    );
});
MemoizedFormItem.displayName = "MemoizedFormItem"