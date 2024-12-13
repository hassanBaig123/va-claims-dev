import { Database as DB, Json } from "../supabase/supabase";

declare global {
    type Database = DB;
    type Prices = DB['public']['Tables']['prices']['Row'];
    type Customers = DB['public']['Tables']['customers']['Row'];
    type Events = DB['public']['Tables']['events']['Row'];
    type Users = DB['public']['Tables']['users']['Row'];
    type Products = DB['public']['Tables']['products']['Row'];
    type Subscriptions = DB['public']['Tables']['subscriptions']['Row'];
    type SwarmSessions = DB['public']['Tables']['swarm_sessions']['Row'];
    type Forms = DB['public']['Tables']['forms']['Row'];
    type ScheduledEvents = DB['public']['Tables']['scheduled_events']['Row'];
    type FormsStatus = DB['public']['Enums']['form_status'];
    type FormsType = DB['public']['Enums']['form_type'];
  }



export type ProcessState = 'NOT_CONNECTED' | 'CONNECTED' | 'READY' | 'AUTHENTICATED' | 'SESSION_STARTED' | 'SUBSCRIBED' | 'JOINED' | 'LEFT' | 'DISCONNECTED' | 'ERROR' | 'NEW_CONNECTION';

export interface SwarmSession {

  id: string;
  name: string;
  description: string;
  swarmId?: string;
  socket?: WebSocket | null;
  processState?: ProcessState;
  placeholderValues?: { [key: string]: string };
  placeholders?: PlaceholderFormat[];
  messages?: Message[];
  agency_chart?: string;
  user_request?: string;
  shared_instructions?: string;
}

export type PlaceholderFormat = {
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'date' | 'large_text';
};

export interface MessageTypes {
    [key: string]: boolean;
}

export interface Message {
    content: string;
    type: string;
}

export type ProductWithPrice = {
    id: string;
    active: boolean | null;
    description: string | null;
    image: string | null;
    metadata: Json | null;
    name: string | null;
    prices: Prices[]; // Assuming Price is already defined, otherwise define it similarly
  };

export interface FormState {
    questions: QuestionProps[];
    answers: QuestionAnswer[];
}
  
export interface AnswersState {
    [key: string]: any; // Add this index signature
}

export interface QuestionnaireData {
  type: string;
  question_groups: any[];
}
