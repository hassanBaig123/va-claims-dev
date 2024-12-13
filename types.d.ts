declare module '@tremor/react';

interface Question {
    label: string;
    component: string;
    options: string[];
    placeholder: string;
    answer: string | { startDate: string, endDate: string } | string[];
}

interface QuestionGroup {
    questions: Question[];
}

type Form = {
    title: string;
    type: string;
    question_groups: QuestionGroup[];
}

type Part = {
    title: string;
    text: string;
}

type Section = {
    title: string;
    parts: Part[];
}

type ResearchReport = {
    title: string;
    description: string;
    sections: Section[];
}

