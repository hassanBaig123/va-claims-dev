declare module '@tremor/react';

interface AnswersState {
  [key: string]: any; // Add this index signature
}

interface FormState {
  questions: any[]
  answers: AnswersState
}

interface Page {
  pageNumber: number
  questions: Question[]
  categories?: string[]
  conditional?: {
    field: string
    value: string
  }
}

interface Question {
  id: string;
  label: string;
  component: string;
  options?: string[];
  placeholder?: string;
  required?: boolean
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

interface StripePaymentFormProps {
  onSuccessfulPayment: (paymentMethodId: string) => void;
  onPaymentProcessing: () => void;
  onFailedPayment: (errorMessage: string) => void;
  selectedProductId: string;
  agreedToTerms: boolean;
  setAgreedToTerms: (agreed: boolean) => void;
  productName: string;
  productPrice: number; // Price in cents
  productDescription: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ProductDetails {
  id: string;
  name: string;
  prices: { unit_amount: number | null }[];
  metadata: {
    active: boolean;
    messages: {
      product_paused?: string;
      not_eligible?: string;
      max_purchases_reached?: string;
    };
    purchase_rules: {
      user_can_purchase: boolean;
      new_user_can_purchase: boolean;
      max_purchases?: string;
      packages_that_can_purchase?: string[];
    };
  };
}

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}


interface User {
  id: string
  email: string
  // Add other user properties here
}

type TaskTemplate = {
  name?: string;
  task?: TaskContext;
};

type ObjectContext = {
  object_id: string;
  type: string;
};

type TaskPayload = {
  node_template_name?: string;
  task?: TaskContext;
  contexts?: Context[];
};

type Context = {
  type: 'users' | 'forms';
  object_id: string;
};

type TaskContext = {
  description?: string;
  input_description?: string;
  action_summary?: string;
  outcome_description?: string;
  feedback?: string[];
  output?: string;
};
