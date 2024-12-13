'use client';
import { useMutation } from "react-query";

export default function ReportsPage() {

    const submitFormMutation = useMutation((reportData: any) => {
        // Replace this with the actual API call
        return fetch('/api/report', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({report: reportData}),
        });
    });

    const reportData = {
        title: 'My Report',
        description: 'This is a report',
        questions: [
            {
                question: 'What is your name?',
                type: 'text',
            },
            {
                question: 'What is your age?',
                type: 'number',
            },
            {
                question: 'What is your favorite color?',
                type: 'text',
            },
        ],
    };

    const handleClick = () => {
        console.log('Submitting form:', reportData);
        submitFormMutation.mutate(reportData);
    }

    return (
    <div>
        <h1>Reports Page</h1>
        <p>This is the reports page</p>

        <button className="btn btn-primary" onClick={handleClick}>Click me</button>
    </div>
    );
}

