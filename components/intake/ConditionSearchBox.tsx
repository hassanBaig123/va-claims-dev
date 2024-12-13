"use client"

import React, { useState } from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CustomInput,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

const conditions = require("../../conditions.json");

interface Condition {
    value: string;
    label: string;
    description?: string;
    system?: string;
    details?: ConditionDetails;
    keywords?: string[];
}

interface ConditionDetails {
    currentDiagnosis: string;
    disabilityRating: number;
    serviceConnected: string;
}

type ConditionSearchBoxProps = {
    options: string[];
    value: Condition[];
    onChange: (value: Condition[]) => void;
    placeholder?: string;
  };

export function ConditionSearchBox({ options, value, onChange, placeholder }: ConditionSearchBoxProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [displayValue, setDisplayValue] = useState("");
    const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
    const [conditionsList, setConditionsList] = useState<Condition[]>([]);
    const [filteredConditions, setFilteredConditions] = useState<Condition[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [conditionDetails, setConditionDetails] = useState<ConditionDetails>({
        currentDiagnosis: "",
        disabilityRating: 0,
        serviceConnected: "",
    });
    const [editingCondition, setEditingCondition] = useState<Condition | null>(null);
    
    const handleSelect = (conditionValue: string) => {
        const selected = conditions.find((condition: Condition) => condition.value === conditionValue);
        if (selected) {
            setDisplayValue(selected.label);
            setSelectedCondition(selected);
            setInputValue("");
        }
        setOpen(false);
    };

    const handleAddCondition = () => {
        if (selectedCondition && !conditionsList.some(c => c.value === selectedCondition.value)) {
            setConditionsList([...conditionsList, selectedCondition]);
            setSelectedCondition(null);
            setDisplayValue("");
            setFilteredConditions(conditions);
            handleDialogOpen(selectedCondition);
        }
    };

    const handleSearch = (searchText: string) => {
        setInputValue(searchText);  // Update the input value as the user types
        const lowercasedFilter = searchText.toLowerCase();
        const filtered = conditions.filter((condition: Condition) => {
            return (condition.label.toLowerCase().includes(lowercasedFilter) ||
                    condition.description?.toLowerCase().includes(lowercasedFilter) ||
                    condition.system?.toLowerCase().includes(lowercasedFilter) ||
                    condition.keywords?.some(keyword => keyword.toLowerCase().includes(lowercasedFilter)));
        });
        setFilteredConditions(filtered);
    };

    React.useEffect(() => {
        setFilteredConditions(conditions);
        console.log("value", value);
        if (value) {
            setConditionsList(value);
        }
    }, [conditions]);
    
    function removeCondition(value: string) {
        setConditionsList(conditionsList.filter((condition: any) => condition.value !== value));
    }

    const handleDialogOpen = (condition: Condition) => {
        setEditingCondition(condition);
        const existingDetails = conditionsList.find(c => c.value === condition.value)?.details;
        setConditionDetails(existingDetails || {
            currentDiagnosis: "",
            disabilityRating: 0,
            serviceConnected: "",
        });
        setDialogOpen(true);
    };
    
    const handleSave = () => {
        if (editingCondition) {
            const updatedConditions = conditionsList.map(c =>
                c.value === editingCondition.value ? { ...c, details: conditionDetails } : c
            );
            setConditionsList(updatedConditions);
            setDialogOpen(false);
            onChange(updatedConditions);
        }
    };

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                        {displayValue || "Select condition..."}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <div className="flex">
                            <CustomInput
                                placeholder="Search conditions..."
                                className="h-9 flex-grow"
                                value={inputValue}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            
                        </div>
                        <CommandGroup>
                            {filteredConditions.map((condition: Condition, index: number) => (
                                <CommandItem key={index} value={condition.value} onSelect={() => handleSelect(condition.value)}>
                                    {condition.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <Button 
                variant="default" 
                className="ml-2" 
                disabled={!selectedCondition}
                onClick={handleAddCondition}
            >
                +
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <table className="mt-4">
                    <thead>
                        <tr>
                            <th>Condition</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {value && conditionsList.map((condition, index) => (
                            <tr key={index}>
                                <td>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => handleDialogOpen(condition)}>Edit</Button>
                                    </DialogTrigger>
                                </td>
                                <td>
                                    <Button onClick={() => removeCondition(condition.value)}>Remove</Button>
                                </td>
                                <td>
                                    {condition.label}
                                    <input type="hidden" name={`condition_${index}_details`} value={JSON.stringify(condition.details || {})} />
                                </td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCondition?.label}</DialogTitle>
                    </DialogHeader>
                    <div>
                        <label>
                            Current Diagnosis:
                            <div>
                                <input type="radio" name="currentDiagnosis" value="Yes" checked={conditionDetails.currentDiagnosis === "Yes"} onChange={(e) => setConditionDetails({ ...conditionDetails, currentDiagnosis: e.target.value })} /> Yes
                                <input type="radio" name="currentDiagnosis" value="No" checked={conditionDetails.currentDiagnosis === "No"} onChange={(e) => setConditionDetails({ ...conditionDetails, currentDiagnosis: e.target.value })} /> No
                            </div>
                        </label>
                        <label>
                            Disability Rating:
                            <div>
                                <select
                                    name="disabilityRating"
                                    value={conditionDetails.disabilityRating}
                                    onChange={(e) => setConditionDetails({ ...conditionDetails, disabilityRating: parseInt(e.target.value) })}
                                    className="h-9 w-full border border-gray-300 rounded-md"
                                >
                                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(rating => (
                                        <option key={rating} value={rating}>
                                            {rating}%
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </label>
                        <label>
                            Service Connected:
                            <div>
                                <input type="radio" name="serviceConnected" value="Yes" checked={conditionDetails.serviceConnected === "Yes"} onChange={(e) => setConditionDetails({ ...conditionDetails, serviceConnected: e.target.value })} /> Yes
                                <input type="radio" name="serviceConnected" value="No" checked={conditionDetails.serviceConnected === "No"} onChange={(e) => setConditionDetails({ ...conditionDetails, serviceConnected: e.target.value })} /> No
                            </div>
                        </label>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button onClick={handleSave}>Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
