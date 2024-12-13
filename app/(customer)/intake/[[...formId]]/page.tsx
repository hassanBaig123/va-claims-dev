'use client';
import { QuestionFactory } from "@/components/intake/QuestionFactory";
import { Progress } from "@/components/ui/progress";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from 'next/router';

interface AnswersState {
    [key: string]: any;  // or specify a more specific type instead of any if possible
}

interface FormState {
    questions: any[];  // Consider defining a more specific type for questions as well
    answers: AnswersState;
}

interface Question {
    id: string;
    label: string;
    component: string;
    options?: string[];
  }
  
  interface Page {
    pageNumber: number;
    questions: Question[];
    conditional?: {
      field: string;
      value: string;
    };
  }

const questionnaireDataset: {pages: Page[]} = {
    pages: [
      {
        pageNumber: 1,
        questions: [
          {
            id: 'military-status',
            label: 'Military Status',
            component: 'radio',
            options: ['Active Duty', 'Veteran']
          },
          {
            id: 'branch-of-service',
            label: 'Branch of Service',
            component: 'dropdown',
            options: ['Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard']
          },
          {
            id: 'dates-of-service',
            label: 'Dates of Service',
            component: 'date-range'
          }
        ]
      },
      {
        pageNumber: 2,
        questions: [
          {
            id: 'diagnosed-conditions',
            label: 'What conditions are you diagnosed with?',
            component: 'condition-search',
            options: [] // Example conditions
          }
        ],
        conditional: {
          field: 'military-status',
          value: 'Active Duty'
        }
      },
      {
        pageNumber: 3,
        questions: [
          {
            id: 'diagnosed-conditions',
            label: 'What conditions are you currently rated for and what is the rating?',
            component: 'condition-search',
            options: []
          },
          {
            id: 'diagnosed-conditions-veteran',
            label: 'What conditions are you currently diagnosed with?',
            component: 'multi-select',
            options: ['Condition A', 'Condition B', 'Condition C']
          },
          {
            id: 'intend-to-file-conditions-veteran',
            label: 'What conditions do you intend to file?',
            component: 'multi-select',
            options: ['Condition A', 'Condition B', 'Condition C']
          }
        ],
        conditional: {
          field: 'military-status',
          value: 'Veteran'
        }
      },
      //{
      //  pageNumber: 4,
      //  questions: [
      //    {
      //      id: 'condition-diagnosed-in-service',
      //      label: 'Was the condition diagnosed in service?',
      //      component: 'radio',
      //      options: ['Yes', 'No']
      //    },
      //    {
      //      id: 'current-diagnosis',
      //      label: 'Do you have a current diagnosis or doctor that would sign a nexus letter for the condition?',
      //      component: 'radio',
      //      options: ['Yes', 'No']
      //    },
      //    {
      //      id: 'condition-severity',
      //      label: 'The severity of the condition according to the 38CFR rating criteria',
      //      component: 'text-area'
      //    },
      //    {
      //      id: 'condition-impact',
      //      label: 'The impact of the condition on your life',
      //      component: 'text-area'
      //    },
      //    {
      //      id: 'condition-symptoms',
      //      label: 'The symptoms of the condition based on the 38 CFR criteria',
      //      component: 'multi-select',
      //      options: ['Symptom A', 'Symptom B', 'Symptom C']
      //    },
      //    {
      //      id: 'condition-duration',
      //      label: 'The duration of the condition',
      //      component: 'text-area'
      //    },
      //    {
      //      id: 'condition-frequency',
      //      label: 'The frequency of the condition',
      //      component: 'text-area'
      //    },
      //    {
      //      id: 'social-occupational-impairment',
      //      label: 'Social and occupational impairment based on the 38 CFR criteria',
      //      component: 'text-area'
      //    }
      //  ]
      //}
    ]
  };

  const Intake2 = ({ params }: { params: { formId: string } }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useSupabaseUser();
    const initializeQuestions = () => {
        return questionnaireDataset.pages.flatMap((page): Question[] => {
            if (!page.conditional) return page.questions;
            return []; // Default to an empty array if formState is not yet available
        });
    };

    const [formState, setFormState] = useState<FormState>({
        questions: initializeQuestions(),
        answers: {}
    });
    const [allPages, setAllPages] = useState<Page[]>(questionnaireDataset.pages);
    const [displayedPages, setDisplayedPages] = useState<Page[]>([]);
    const [progress, setProgress] = useState(0);
    const [formId, setFormId] = useState(null);

    useEffect(() => {
        if(!user) return;

        if(formId == null) {
            console.log(`Initializing form with user id and formId: ${user?.id} and ${formId}`);
            initializeFormMutation.mutate();
        }
        else if(formId) {
            console.log(`Retrieving form with formId: ${formId}`);
            retrieveFormMutation.mutate(formId);
        }
      }, [user]);
    
    useEffect(() => {
        updateProgress();
    }, [currentPage, formState.answers]);

    const updateProgress = () => {
        const totalDisplayablePages = displayedPages.length;
        const completedPages = displayedPages.filter((page, index) => 
            index < currentPage - 1 && isPageComplete(page.pageNumber)).length;
        const newProgress = (completedPages / totalDisplayablePages) * 100;
        setProgress(newProgress);
    };

    const isPageComplete = (pageNumber: number) => {
        const page = questionnaireDataset.pages.find(p => p.pageNumber === pageNumber);
        if (!page) return false;  // Ensure the page exists
        return page.questions.every(question => {
            const answer = formState.answers[question.id];
            // You might need to adjust validation based on the question type if necessary
            return answer !== undefined && answer !== '';
        });
    };

    useEffect(() => {
        console.log("Displayed Pages:", displayedPages);
    }, [displayedPages]);

    useEffect(() => {
        // Check if the current page is still valid
        if (!displayedPages.find(p => p.pageNumber === currentPage)) {
            // If the current page is no longer valid, move to the first available page
            setCurrentPage(displayedPages[0]?.pageNumber || 1);
        }
    }, [displayedPages, currentPage]);

    useEffect(() => {
        setFormState(prevState => ({
            ...prevState,
            questions: questionnaireDataset.pages.flatMap((page): Question[] => {
                if (!page.conditional) return page.questions;
                const conditionMet = Array.isArray(prevState.answers[page.conditional.field])
                    ? prevState.answers[page.conditional.field].includes(page.conditional.value)
                    : prevState.answers[page.conditional.field] === page.conditional.value;
                return conditionMet ? page.questions : [];
            })
        }));
    }, [formState.answers]);

    useEffect(() => {
        const filteredPages = allPages.filter(page => {
            if (!page.conditional) return true; // Always include pages without conditionals
            const conditionMet = Array.isArray(formState.answers[page.conditional.field])
                ? formState.answers[page.conditional.field].includes(page.conditional.value)
                : formState.answers[page.conditional.field] === page.conditional.value;
            return conditionMet;
        });
    
        setDisplayedPages(filteredPages);
    
        // Handle current page not valid anymore
        const currentPageIsValid = filteredPages.some(p => p.pageNumber === currentPage);
        if (!currentPageIsValid) {
            setCurrentPage(filteredPages[0]?.pageNumber || 1);
        }
    }, [formState.answers, allPages]);
  
    //useEffect(() => {
    //    const page = questionnaireDataset.pages.find(p => p.pageNumber === currentPage);
    //    if (page) {
    //        if (page.conditional) {
    //            const conditionMet = Array.isArray(formState.answers[page.conditional.field])
    //                ? formState.answers[page.conditional.field].includes(page.conditional.value)
    //                : formState.answers[page.conditional.field] === page.conditional.value;
    //
    //            if (conditionMet) {
    //                setFormState(prevState => ({
    //                    ...prevState,
    //                    questions: page.questions
    //                }));
    //            } else {
    //                setFormState(prevState => ({
    //                    ...prevState,
    //                    questions: []
    //                }));
    //            }
    //        } else {
    //            setFormState(prevState => ({
    //                ...prevState,
    //                questions: page.questions
    //            }));
    //        }
    //    }
    //}, [currentPage, formState.answers]);

    useEffect(() => {
        console.log("Current Page:", currentPage);
        console.log("Questions on Current Page:", formState.questions);
    }, [currentPage, formState.questions]);
  
    const onChange = (questionId: string, newAnswer: any) => {
        setFormState(prevState => ({
            ...prevState,
            answers: {
                ...prevState.answers,
                [questionId]: newAnswer
            }
        }));
    };
  
    const goToPage = (direction: 'next' | 'previous') => {
        if (direction === 'next') {
            const currentIndex = displayedPages.findIndex(p => p.pageNumber === currentPage);
            const nextPage = displayedPages[currentIndex + 1]; // Get the next page in the displayedPages array
            if (nextPage) {
                setCurrentPage(nextPage.pageNumber);
            } else {
                console.error("No next page available.");
            }
        } else if (direction === 'previous') {
            const currentIndex = displayedPages.findIndex(p => p.pageNumber === currentPage);
            const prevPage = displayedPages[currentIndex - 1]; // Get the previous page
            if (prevPage) {
                setCurrentPage(prevPage.pageNumber);
            } else {
                console.error("No previous page available.");
            }
        }
    };

    const initializeFormMutation = useMutation(() => {
        console.log("Initializing form with user id:", user?.id);
        return fetch('/api/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ form: { type: "intake", title: "Intake Sheet", status: "created", user_id: user?.id } })
        }).then(response => response.json())
          .then(data => {
              console.log("Form initialization response:", data); // Add logging here
              const answers = data.form.questions.reduce((acc, question) => {
                    acc[question.question.id] = question.answer;
                    return acc;
                }, {});
              setFormId(data.id);
              setFormState(prevState => ({
                ...prevState,
                questions: initializeQuestions(),
                answers: answers
              }));
              console.log("Form State:", formState);
          }).catch(error => {
              console.error("Error initializing form:", error); // Add error logging
          });
    });

    const submitFormMutation = useMutation((form: any) => {
        console.log("Submitting form:", form);
      return fetch(`/api/form/${form.id}`, {
          method: 'PUT',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({form: form}),
      });
  });

  const retrieveFormMutation = useMutation((formId: string) => {
      return fetch(`/api/form/${formId}`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          }
      });
  });

  const mergeQuestionsAndAnswers = (questions: Question[], answers: AnswersState) => {
      return questions.map(question => ({
          question: question,
          answer: answers[question.id]
      }));
  };

  const handleSubmit = () => {
      if(!formState) return;
      console.log('Submitting form:', mergeQuestionsAndAnswers(formState.questions, formState.answers));
      submitFormMutation.mutate({id: formId, title: "Intake Sheet", type: "intake", status: "submitted", questions: mergeQuestionsAndAnswers(formState.questions, formState.answers)});
  };

    return (
      <>
        <div className="flex flex-col gap-4 items-center">
            {progress < 100 && progress > 0 && (
                <div>{progress.toFixed(0)}%</div>
            )}
            <div style={{ width: '100%', backgroundColor: '#e0e0e0' }}>
                <div style={{ width: `${progress}%`, backgroundColor: 'blue', height: '5px' }}></div>
            </div>
            <div>Page {currentPage}</div>
        </div>
        <div className="flex flex-col container gap-4">
          {formState.questions
              .filter(question => displayedPages.find(page => page.pageNumber === currentPage)?.questions.includes(question))
              .map((question, index) => (
                  <QuestionFactory
                      key={index}
                      question={question}
                      value={formState.answers[question.id] || ''}
                      onChange={(answer) => onChange(question.id, answer)}
                  />
              ))}
      </div>
        <div className="text-center mt-5">
            <button
                onClick={() => goToPage('previous')}
                disabled={displayedPages[0] && currentPage === displayedPages[0].pageNumber}
                className={`px-4 py-2 rounded text-white ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
            >
                Previous
            </button>
            {displayedPages[displayedPages.length - 1] && currentPage === displayedPages[displayedPages.length - 1].pageNumber ? (
            <button
                onClick={handleSubmit} // Your submit function
                disabled={!isPageComplete(currentPage)}
                className={`ml-4 px-4 py-2 rounded text-white ${!isPageComplete(currentPage) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
                Submit
            </button>
        ) : (
            <button
                onClick={() => goToPage('next')}
                disabled={!isPageComplete(currentPage)}
                className={`ml-4 px-4 py-2 rounded text-white ${!isPageComplete(currentPage) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
            >
                Next
            </button>
        )}
        </div>
      </>
    );
  };
  
  export default Intake2;
