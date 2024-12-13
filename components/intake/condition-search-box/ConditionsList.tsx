import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Condition {
  label: string;
  value: string;
  code: string;
}

interface ConditionsListProps {
  conditionsList: Condition[];
  handleDialogOpen: (condition: Condition) => void;
  removeCondition: (value: string) => void;
  setIsEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConditionsList: React.FC<ConditionsListProps> = ({
  conditionsList,
  handleDialogOpen,
  removeCondition,
  setIsEditModal,
}) => {
  return (
    <div className="space-y-4">
      {conditionsList.map((condition, index) => (
        <div
          key={condition.code}
          className="flex flex-col sm:flex-row sm:items-center justify-between pl-1 pt-4 pb-4 pr-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="font-medium text-gray-800 mb-2 sm:mb-0">
            {condition.label}
          </span>
          <div className="flex space-x-2 sm:ml-4">
            <Button
              onClick={() => {
                handleDialogOpen(condition)
                setIsEditModal(true);
              }}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              onClick={() => removeCondition(condition.value)}
              variant="destructive"
              size="sm"
              className="flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
