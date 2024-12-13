import React, { memo } from 'react';

const normalizeDate = (inputDate: string): string => {
    const date = new Date(inputDate);
    const normalizedDate = date.toISOString().split('T')[0];
    return normalizedDate;
};

const DateConverter: React.FC<{ dateString: string }> = ({ dateString }) => {
    const normalizedDate = normalizeDate(dateString);

    return <p className='text-gray-500 w-full text-end mt-4 text-xs pr-2'>{normalizedDate}</p>
};

const MemoizedDateConverter = memo(DateConverter, (prevProps, nextProps) => {
    return prevProps.dateString === nextProps.dateString;
});

export default MemoizedDateConverter;
