'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import DynamicForm from './DynamicForm';
import { StatusUpdate, TaskCallback, TaskMessage, Update, useSwarm } from '@/lib/providers/swarm-provider';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { AnswersState, ProcessState, QuestionnaireData } from '@/models/local/types';
import { toast } from '../ui/use-toast';
import { User } from '@supabase/supabase-js';
import { Skeleton } from '../ui/skeleton';

interface DynamicFormContainerProps {
    onGroupCompletionChange: (isComplete: boolean) => void;
    currentGroupIndex: number;
    setQuestionnaireData: (questionnaireData: any) => void;
    setState: (processState: ProcessState) => void;
    setSessionId: (sessionId: string) => void;
    taskId: string;
}

interface FormState {
    questions: any[];
    answers: AnswersState[];
}

const DynamicFormContainer: React.FC<DynamicFormContainerProps> = (
    { onGroupCompletionChange,
        currentGroupIndex,
        setQuestionnaireData,
        setState,
        setSessionId,
        taskId
    }: DynamicFormContainerProps) => {
    const [formState, setFormState] = useState<FormState>({ questions: [], answers: [] });
    const [processState, setProcessState] = useState<ProcessState>('DISCONNECTED');
    const { setUpdateHandler, authenticateSession, subscribeToSession } = useSwarm();
    const { user } = useSupabaseUser();
    const sessionIdRef = useRef<string | null>(null);
    const taskIdRef = useRef<string | null>(null);
    const [answers, setAnswers] = useState<AnswersState[]>([]);
    const questionnaireData = useRef<QuestionnaireData | null>(null);


    useEffect(() => {
        taskIdRef.current = taskId;
    }, [taskId]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if(!user) return;

        //console.log('Setting up immediate update handler...');
        const immediateUpdateHandler = async (update: Update) => {
            //console.log('Immediate update:', update);
            switch (update.type) {
            case 'status':
                console.log('Status:', update);
                await handleSocketStatusMessage(update);
                break;
            case 'error':
                handleSocketErrorMessage(update.sessionId, update.error);
                break;
            case 'session':
                handleSocketSessionMessage(update.sessionId, update);
                break;
            case 'task':
                handleSocketTaskMessage(update.sessionId, update);
                break;
            default:
                handleSocketUnknownMessage(update.sessionId, update);
                break;
            }
        };

        // Set the update handler to the immediateUpdateHandler
        setUpdateHandler(immediateUpdateHandler);

      return () => 
      {
        setUpdateHandler(() => {});
      }
    }, [user]);

    const handleSocketSessionMessage = (sessionId: string, eventData: any) => {
        console.log('Session:', eventData);
    };

    const handleSocketErrorMessage = (sessionId: string, eventData: any) => {
        console.error('Error:', eventData.error);
    };

    const handleSocketUnknownMessage = (sessionId: string, eventData: any) => {
        try {
            console.error('Unknown status:', JSON.stringify(eventData));
        } catch (error) {
            console.error('Could not stringify socket message:', error);
            console.error('Event Data:', eventData);
        }
    };


    const handleSocketTaskMessage = (_: string, eventData: TaskCallback) => {
        const { task_id, session_id, response } = eventData;
        console.log('Task:', eventData);
        console.log('Current Task_id for response:', task_id, 'Current set TaskId:', taskIdRef.current);
        console.log('Current Session_id for response:', session_id, 'Current set SessionId:', sessionIdRef.current);
        
        if (task_id === taskIdRef.current && session_id === sessionIdRef.current) {
            console.log('GenerateQuestionnaire task:', response);
            const newQuestionnaireData = JSON.parse(response);
            
            console.log('Received new questionnaire data:', newQuestionnaireData); // Additional debug log
            
            let updatedQuestionnaireData: any;
            let newAnswers = [...answers]; // Clone the current answers state
            
            if (questionnaireData.current) {
                // Merge the additional question groups with the existing ones
                const existingGroups = questionnaireData.current.question_groups;
                updatedQuestionnaireData = {
                    ...questionnaireData.current,
                    type: newQuestionnaireData.type,
                    question_groups: [...existingGroups, ...newQuestionnaireData.question_groups],
                };
                
                console.log('Merged questionnaire data:', updatedQuestionnaireData); // Additional debug log
                
                // Update answers state to include new question groups initialized with empty strings
                newQuestionnaireData.question_groups.forEach((group: any) => {
                    const groupAnswers = group.questions.reduce((acc: any, _: any, index: number) => {
                        acc[index.toString()] = ''; // Initialize each answer with an empty string
                        return acc;
                    }, {} as AnswersState);
                    newAnswers.push(groupAnswers); // Add new group answers
                });
            } else {
                // If questionnaireData is null, simply use the new data
                updatedQuestionnaireData = {
                    ...newQuestionnaireData,
                    question_groups: newQuestionnaireData.question_groups,
                };
                
                // Initialize answers for the new questionnaire data
                newAnswers = newQuestionnaireData.question_groups.map((group: any) =>
                    group.questions.reduce((acc: any, question: any, index: any) => {
                        acc[index.toString()] = ''; // Initialize each answer with an empty string
                        return acc;
                    }, {} as AnswersState)
                );
            }
    
            updatedQuestionnaireData.type = newQuestionnaireData.type;
            
            setQuestionnaireData(updatedQuestionnaireData);
            questionnaireData.current = updatedQuestionnaireData;
            
            // Update the formState with the new question groups
            setFormState(prevFormState => (
                    {
                        ...prevFormState,
                        questions: updatedQuestionnaireData.question_groups,
                    }
                )
            );
        }
    };

    /// Handle the status message from the server, required for the initial connection and retrieving the session id
    const handleSocketStatusMessage = async (eventData: StatusUpdate) => {
        if(!user) return;
        if ('status' in eventData) {
            switch(eventData.status) {
                case 'CONNECTED':
                    setSessionId(eventData.session_id);
                    sessionIdRef.current = eventData.session_id;
                    handleProcessStateChange(eventData.session_id, 'CONNECTED');
                    authenticateSession(user.id, eventData.session_id)
                    break;
                case 'READY':
                    if(!sessionIdRef.current) return;
                    subscribeToSession(user.id, sessionIdRef.current);
                    console.log('Subscribing ', user.id, 'to session:', sessionIdRef.current);
                    handleProcessStateChange(sessionIdRef.current, 'READY');
                    break;
                case 'JOINED':
                    console.log('Success:', eventData.status);
                    handleProcessStateChange(eventData.session_id, 'JOINED');
                    break;
                case 'SUBSCRIBED':
                    if(!sessionIdRef.current) return;
                    console.log('Success:', eventData.status);
                    handleProcessStateChange(sessionIdRef.current, 'SUBSCRIBED');
                    break;
                case 'LEFT':
                    console.log('New task started:', eventData.status);
                    handleProcessStateChange(eventData.session_id, 'LEFT');
                    break;
                case 'DISCONNECTED':
                    console.log('New task started:', eventData.status);
                    handleProcessStateChange(eventData.session_id, 'DISCONNECTED');
                    break;
                default:
                    handleProcessStateChange(eventData.session_id, eventData.status, eventData.message);
                    break;
            }
        } else {
            console.error('Status message does not contain a status:', eventData);
        }
    };

    const handleProcessStateChange = (sessionId: string, newState: ProcessState, message?: any) => {
        setProcessState(newState);
        setState(newState);
        toast({
          title: 'Process State Changed',
          description: (
            <>
                <pre>{`Process state changed to ${newState} for session ${sessionId}`}</pre>
                <pre>{`Message: ${message}`}</pre>
            </>
          )
        });
    };

    const updateAnswer = (groupIndex: number, questionIndex: number, answer: any) => {
        const updatedAnswers = [...answers];
        if (!updatedAnswers[groupIndex]) {
          updatedAnswers[groupIndex] = {};
        }
        updatedAnswers[groupIndex][questionIndex.toString()] = answer;
        console.log('Updated answers:', updatedAnswers);
        setAnswers(updatedAnswers);
        
        // Update the questionnaireData state with the new answer
        setQuestionnaireData((prevData: QuestionnaireData) => {
            if (!prevData.question_groups || prevData.question_groups.length <= groupIndex) {
                console.error('Invalid groupIndex or question_groups is not set correctly in questionnaireData');
                return prevData; // Return previous data if the current group index is invalid
            }
            const updatedData = { ...prevData };
            // Clone the group to avoid direct state mutation
            const updatedGroup = { ...updatedData.question_groups[groupIndex] };
            // Clone the questions array within the group
            updatedGroup.questions = [...updatedGroup.questions];
            // Update the specific question's answer within the cloned questions array
            updatedGroup.questions[questionIndex] = {
                ...updatedGroup.questions[questionIndex],
                answer: answer,
            };
            // Replace the group within the question_groups array with the updated group
            updatedData.question_groups[groupIndex] = updatedGroup;
            
            console.log('Updated questionnaireData with new answer:', updatedData);
            return updatedData;
        });
    };

    // Line 350-355 Update the isGroupComplete function to handle potential undefined question_groups more robustly
    const isGroupComplete = (groupIndex: number, answers: AnswersState[], questionnaireData: QuestionnaireData) => {
        console.log('Checking group:', groupIndex, 'with answers:', answers[groupIndex]);
        console.log('Questionnaire Data:', questionnaireData);
        if (!questionnaireData || !Array.isArray(questionnaireData.question_groups) || groupIndex >= questionnaireData.question_groups.length) {
            console.error('questionnaireData.question_groups is not an array or groupIndex is out of bounds:', groupIndex);
            return false;
        }
    
        const group = questionnaireData.question_groups[groupIndex];
        if (!group || !Array.isArray(group.questions) || !answers[groupIndex]) {
            console.error(`Group at index ${groupIndex} is not properly defined or answers[groupIndex] is missing.`);
            return false;
        }
    
        for (let questionIndex = 0; questionIndex < group.questions.length; questionIndex++) {

            const question = group.questions[questionIndex];
            const answer = answers[groupIndex][questionIndex.toString()];

            if (question.component === 'date-range') {
                if (!(answer as any)?.startDate || !(answer as any)?.endDate) {
                    return false;
                }
            } else {
                // Check if the answer is not null, undefined, or an empty string/array
                if (answer === null || answer === undefined || answer.length === 0) {
                    return false;
                }
            }
        }
    
        return true;
    };

    useEffect(() => {
        // Call the callback with the current completion state
        if(!questionnaireData.current) return;
        if(isGroupComplete(currentGroupIndex, answers, questionnaireData.current)) {
            onGroupCompletionChange(true);
        }
    }, [updateAnswer]);

    return (
        (questionnaireData.current === null) ? (
                <div className="flex w-full container flex-col gap-5">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                </div>
            ) : (
                <>
                    <DynamicForm
                        questions={formState.questions}
                        answers={answers}
                        updateAnswer={updateAnswer}
                        currentGroupIndex={currentGroupIndex}
                    />
                </>
            )
        );
  };
  
  export default DynamicFormContainer;
