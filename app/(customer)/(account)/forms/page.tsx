'use client';
import { useRouter } from "next/navigation";
import { headers } from "next/headers";
import { useMutation } from "react-query";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormsTable } from "@/components/admin/forms-table";

export default function FormPage() {
    const [forms, setForms] = useState<Forms[] | null>(null);
    const router = useRouter();

    const getFormsMutation = useMutation(() => {
        // Replace this with the actual API call
        return fetch('/api/forms', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });
    });

    // Line 22-38: Wrap getForms in useCallback
    const getForms = useCallback(async (): Promise<Forms[]> => {
        const response = await getFormsMutation.mutateAsync();
        if (response.status === 200) {
        const json = await response.json();
        // Ensure that the parsed JSON is an array of form objects
        return Array.isArray(json) ? json : [json];
        } else {
        throw new Error("Failed to fetch forms");
        }
    }, [getFormsMutation]);
    
    // Line 41-48: Update the useEffect hook
    useEffect(() => {
        getForms().then(forms => {  
        // console.log("Forms: ", forms);
        setForms(forms);
        }).catch(error => {
        console.error("Error fetching forms:", error);
        });
    }, [getForms]);
    
    return (
        <div>
            Forms Page
            <div>
            {forms && forms.length !== 0 && (
                <FormsTable
                    forms={forms}
                />
            )}
            </div>
        </div>
    );
}

