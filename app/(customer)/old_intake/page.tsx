'use client';
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from 'react-query';
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useSwarmSessions } from "@/lib/hooks/use-swarm-sessions";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { StatusUpdate, Update, useSwarm, Task, ErrorUpdate, TaskCallback, MessageUpdate, TaskMessage } from "@/lib/providers/swarm-provider";
import { Message, ProcessState, QuestionnaireData } from "@/models/local/types";
import { Modal } from '@/components/intake/Modal';
import DynamicFormContainer from '@/components/intake/DynamicFormContainer';

interface IntakePageProps {
    params: { customer: string };
}

const IntakePage = ({ params: { customer } }: IntakePageProps) => {
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [answers, setAnswers] = useState<AnswersState[]>([]);
    const initialized = useRef(false);
    const [isCurrentGroupComplete, setIsCurrentGroupComplete] = useState(false);
    const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
    const { sendTask } = useSwarm();
    const [groupType, setGroupType] = useState<string>('');
    const [sessionId, setSessionId] = useState<string>('');
    const [state, setState] = useState<ProcessState | null>(null);
    const [currentTaskId, setCurrentTaskId] = useState<string>('');
    const [remaining, setRemaining] = useState(false);

    const questionnaireObjective = `Based on the 38CFR, create a questionnaire for the veteran to fill out based on the information provided
    in the user's request to ensure we have collected all of the necessary information about the veteran's condition. 
    
    We will not collect names, phone numbers, addresses, or other identifible information. 
    We will only collect information about the veteran's condition.
    
    If the request is for an initial intake partial questionnaire, only generate questions for the veteran to answer based on the following information:
        1.) Military Status|radio
        2.) Branch of Service|dropdown
        3.) Dates of Service|date-range

    One you understand the veteran's military status, branch of service, and dates of service, you can generate questions based on the following criteria:

    If the user is Active Duty:
        1.) What conditions are they diagnosed with?|multi-select
        2.) What conditions do they intend to file?|multi-select
        3.) What conditions are they currently receiving treatment for?|multi-select

    If the user is a Veteran:
        1.) What conditions are they currently rated for and what is the rating?|multi-select
        2.) What conditions are they currently diagnosed with?|multi-select
        3.) What conditions do they intend to file?|multi-select

    If you understand the conditions that the veteran is diagnosed with, you can generate questions based on the following criteria for a specific condition:
        1.)  If the condition was diagnosed in service.|radio
        2.) Do they have a current diagnosis or doctor that would sign a nexus letter for the condition?|radio
        3.) The severity of the condition according to the 38CFR rating criteria.|textarea
        4.) The impact of the condition on the veteran's life.|textarea
        5.) The symptoms of the condition based on the 38 CFR criteria for the condition.|multi-select
        6.) The duration of the condition based on the 38 CFR criteria for the condition.|textarea
        7.) The frequency of the condition based on the 38 CFR criteria for the condition.|textarea
        8.) Social and occupational impairment based on the 38 CFR criteria for the condition.|textarea`;

    const generateInitialFormTask = useCallback((): TaskMessage => ({
        id: Math.random().toString().slice(2),
        name: "Generate Initial Intake Form",
        description: "Generate an initial intake form based on user inputs.",
        assignee: "QuestionnaireWriter",
        set_function_call: "GenerateQuestionnaire",
        parameters: {
            type: 'monitoring',
            generator: {
                function: "GenerateQuestionnaire",
                parameters: {
                    type: "initial"
                }
            }
        },
        status: 'pending',
        context: {
            instructions: 'Generate an initial partial intake form.',
            objective: questionnaireObjective,
            request: 'Generate an initial intake partial questionnaire.',
        }
    }), [questionnaireObjective]);

    const generateRemainingFormTask = (questionnaireData: any): TaskMessage => ({
        id: Math.random().toString().slice(2),
        name: "Generate Remaining Intake Form Parts",
        description: "Generate the remaining parts of the intake form.",
        assignee: "QuestionnaireWriter",
        set_function_call: "GenerateQuestionnaire",
        status: 'pending',
        context: {
            instructions: 'Generate a remaining intake form with the information provided.',
            objective: questionnaireObjective,
            request: 'Generate a remaining intake questionnaire.',
            answers: questionnaireData
        }
    });


    const handleGroupCompletionChange = (isComplete: boolean) => {
        // console.log(`Group ${currentGroupIndex} is complete:`, isComplete);
        setIsCurrentGroupComplete(isComplete);
        setButtonVisibility();

        if (isComplete) {
            // console.log('Current questions and answers:', questionnaireData);
        }
    };

    const setButtonVisibility = useCallback(() => {
        if (!questionnaireData) return;

        const nextButton = document.getElementById('next-button');
        const submitButton = document.getElementById('submit-button');

        if (currentGroupIndex < questionnaireData?.question_groups?.length - 1 || questionnaireData?.type === "initial") {
            if (nextButton) nextButton.style.display = 'block';
            if (submitButton) submitButton.style.display = 'none';
        } else {
            if (nextButton) nextButton.style.display = 'none';
            if (submitButton) submitButton.style.display = 'block';
        }
    }, [currentGroupIndex, questionnaireData]);

    useEffect(() => {
        if (!sessionId) return;

        if (!initialized.current && state === 'SUBSCRIBED') {
            const task = generateInitialFormTask();
            setCurrentTaskId(task.id);
            sendTask(sessionId, task);
            initialized.current = true;
        }

        if (!questionnaireData) return;

        if (isCurrentGroupComplete) {
            setIsCurrentGroupComplete(false);
        }
    }, [sessionId, state, generateInitialFormTask, isCurrentGroupComplete, questionnaireData, sendTask]);

    useEffect(() => {
        setButtonVisibility();
    }, [currentGroupIndex, questionnaireData, setButtonVisibility]);

    const callRemainingFormTask = (questionnaireData: any) => {
        if (questionnaireData?.type === "initial" && isCurrentGroupComplete) {
            setRemaining(true);
            const task = generateRemainingFormTask(questionnaireData);
            setCurrentTaskId(task.id);
            sendTask(sessionId, task);
        }
    };

    const submitFormMutation = useMutation((questionnaireData: QuestionnaireData) => {
        return fetch('/api/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ form: questionnaireData }),
        });
    });

    const handleSubmit = () => {
        if (!questionnaireData) return;
        if (!Array.isArray(questionnaireData.question_groups)) {
            return;
        }
        const questions = questionnaireData.question_groups.flatMap((group: any) => group.questions);
        if (!Array.isArray(questions)) {
            return;
        }
        // console.log('Submitting form:', questionnaireData);
        submitFormMutation.mutate(questionnaireData);
    };

    const handlePreviousGroup = () => {
        if (currentGroupIndex > 0) {
            setCurrentGroupIndex(currentGroupIndex - 1);
        }
    };

    const handleNextGroup = () => {
        if (!sessionId) return;
        callRemainingFormTask(questionnaireData);
        setCurrentGroupIndex(currentGroupIndex + 1);
    };

    const progressPercentage = (questionnaireData?.question_groups) ? ((currentGroupIndex + 1) / questionnaireData?.question_groups?.length) * 100 : null;

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="disclaimer-content">
                    <p>Please read the following disclaimer carefully before proceeding:</p>
                    <p>
                        This form serves as a means to better understand your health condition. However, it should not be seen as a replacement for a professional medical diagnosis. We encourage you to seek advice from a healthcare professional for any questions regarding your health.
                        <br /><br />
                        By proceeding with this form, you acknowledge and consent to our company's terms and conditions.
                        <br /><br />
                        Rest assured, your personal information will be treated with the utmost confidentiality and security.
                        <br />
                        --------------------------------<br />
                    </p>
                    <p className="signature">Company Name</p>
                </div>
            </Modal>
            <div className="flex flex-col items-center justify-center">
                <Separator />
                {questionnaireData?.type != "initial" && !isCurrentGroupComplete ? (
                    <>
                        {remaining && <Progress value={progressPercentage} />}
                        <div className="text-center text-sm font-semibold mt-2">{remaining && (
                            progressPercentage?.toFixed(0) + '%'
                        )}

                        </div>
                    </>
                ) : (
                    <></>
                )}
                <div className={`flex w-full container flex-col`}>
                    {questionnaireData && (
                        <>
                            <h2 className="text-2xl font-semibold text-center">{questionnaireData?.question_groups?.[currentGroupIndex]?.title}</h2>
                            <p className="text-md text-gray-300 mt-2 text-center">Please answer the following questions to the best of your ability.</p>
                        </>
                    )}
                    <div className="flex flex-col justify-between gap-3">
                        <DynamicFormContainer
                            onGroupCompletionChange={handleGroupCompletionChange}
                            currentGroupIndex={currentGroupIndex}
                            setQuestionnaireData={setQuestionnaireData}
                            setState={setState}
                            setSessionId={setSessionId}
                            taskId={currentTaskId}
                        />
                    </div>
                </div>
                <div className={`flex justify-center mt-4 ${questionnaireData ? 'block' : 'hidden'}`}>
                    <button
                        onClick={handlePreviousGroup}
                        disabled={currentGroupIndex === 0}
                        className={`mx-2 px-4 py-2 rounded ${currentGroupIndex === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}>
                        Previous
                    </button>
                    <button
                        id="next-button"
                        onClick={handleNextGroup}
                        disabled={!isCurrentGroupComplete}
                        className={`mx-2 px-4 py-2 rounded ${!isCurrentGroupComplete ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-700'}`}
                    >
                        Next
                    </button>
                    <button
                        id="submit-button"
                        onClick={handleSubmit}
                        disabled={!isCurrentGroupComplete}
                        style={{ display: 'none' }}
                        className="mx-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-700"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
};

export default IntakePage;
