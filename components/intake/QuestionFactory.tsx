import { TextInput } from './TextInput';
import { TextAreaInput } from './TextAreaInput';
import { Dropdown } from './Dropdown';
import { RadioInput } from './Radio';
import { Checkbox } from './Checkbox';
import { NumberInput } from './NumberInput';
import { DateInput } from './DateInput';
import { MultiSelect } from './Multiselect';
import { Slider } from './Slider';
import { SignaturePad } from './SignaturePad';
import { DateRange } from './DateRange';
import { Label } from '../ui/label';
import { ConditionSearchBox } from './ConditionSearchBox';

// DynamicForm.tsx
interface QuestionAnswer {
  questionId: string;
  answer: any;
}

interface FormState {
  questions: QuestionProps[];
  answers: QuestionAnswer[];
}

type QuestionProps = {
  question: any;
  value: any;
  onChange: (value: any) => void;
};

export const QuestionFactory = ({ question, value, onChange }: QuestionProps) => {
    return (
      <div>
        <label>{question.label}</label>
        {(() => {
          switch (question.component) {
            case 'condition-search':
              return <ConditionSearchBox value={value} onChange={onChange} placeholder={question.placeholder} options={question.options} />;
            case 'text':
              return <TextInput value={value} onChange={onChange} placeholder={question.placeholder} />;
            case 'text-area':
                return <TextAreaInput value={value} onChange={onChange} placeholder={question.placeholder} />;
            case 'dropdown':
              return <Dropdown options={question.options} value={value} onChange={onChange} />;
            case 'radio':
                return <RadioInput options={question.options} value={value} onChange={onChange} />;
            case 'checkbox':
                return <Checkbox label={question.label} checked={value} onChange={onChange} />;
            case 'number':
                return <NumberInput value={value} onChange={onChange} />;
            case 'date':
                return <DateInput value={value} onChange={onChange} />;
            case 'multi-select':
                return <MultiSelect options={question.options} value={value} onChange={onChange} />;
            case 'slider':
                return <Slider min={question.min} max={question.max} value={value} onChange={onChange} />;
            case 'signature-pad':
                return <SignaturePad onEnd={onChange} />;
            case 'date-range':
                return <DateRange dates={value} onChange={onChange} />;
            case 'label':
                return <Label> {value} </Label>;
            default:
            return null;
            }
        })()}
    </div>
  );
};
