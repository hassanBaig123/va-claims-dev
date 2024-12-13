'use client';
import { Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table"
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup, faAngleDown, faAngleUp,faAnglesUpDown } from '@fortawesome/pro-solid-svg-icons';
import { OrderDetailsDialog } from "./orders-detail-dialog";
import { useRouter } from "next/navigation";


interface FormsTableProps {
    forms: Forms[];
}

type FormKey = keyof Forms;
  
export const FormsTable: React.FC<FormsTableProps> = (props) => {
    const [sortedData, setSortedData] = useState(props.forms);
    const [sortDirection, setSortDirection] = useState<{[key in FormKey]?: "asc" | "desc"}>({});
    const [isOpen, setIsDialogOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState(props.forms[0]);
    const [tempSearchQuery, setTempSearchQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    const handleSort = (column: FormKey) => {
        const newDirection = sortDirection[column] === "asc" ? "desc" : "asc";
        const sorted = [...sortedData].sort((a, b) => {
            if (a[column] === null) return newDirection === "asc" ? 1 : -1;
            if (b[column] === null) return newDirection === "asc" ? -1 : 1;
            if (a[column]! < b[column]!) return newDirection === "asc" ? -1 : 1;
            if (a[column]! > b[column]!) return newDirection === "asc" ? 1 : -1;
            return 0;
        });
        setSortedData(sorted);
        setSortDirection({...sortDirection, [column]: newDirection});
    };
 
    const handleRowClick = (form: typeof props.forms[number]) => {
        setSelectedForm(form);
        //Navigate to the forms/:id page
        router.push(`/forms/${form.id}`);
        
    }

    const handleClose = (open: any) => {
        if (!open) {
            setIsDialogOpen(false);
          }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempSearchQuery(e.target.value);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setSearchQuery(tempSearchQuery);
    };

    const handleResetSearch = () => {
        setTempSearchQuery("");
        setSearchQuery("");
        setCurrentPage(1); // Reset to the first page
    };

    const filteredData = sortedData.filter((form) =>
        Object.values(form).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
    <div>
        <OrderDetailsDialog order={selectedForm} open={isOpen} onOpenChange={setIsDialogOpen} />
        <form onSubmit={handleSearch} className="mb-4 flex justify-end space-x-2">
            <Input
                type="text"
                placeholder="Search orders..."
                value={tempSearchQuery}
                onChange={handleSearchChange}
                className="w-1/4 bg-gray-600"
            />
            <Button type="submit">Search</Button>
            <Button type="button" onClick={handleResetSearch}>Reset</Button> {/* Reset button added */}
        </form>

        
        <Table>
            <TableHeader>
            <TableRow>
            <TableHead className="sortable" data-sort="title" role="button" tabIndex={0} onClick={() => handleSort('title')}>
                    Title
                    {sortDirection['title'] ? (
                        sortDirection['title'] === 'asc' ? (
                            <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                        )
                    ) : (
                        <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1"/>
                    )}
                </TableHead>
                <TableHead className="w-[150px] text-left sortable" data-sort="created_at" role="button" tabIndex={0} onClick={() => handleSort('created_at')}>
                    Date
                    {sortDirection['created_at'] ? (
                        sortDirection['created_at'] === 'asc' ? (
                            <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                        )
                    ) : (
                        <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
                    )}
                </TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {currentItems.map((form) => (
                <TableRow key={form.id} onClick={() => handleRowClick(form)} className="cursor-pointer">
                <TableCell className="text-left">{form.title}</TableCell>
                <TableCell>{form.created_at}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        <div className="flex justify-center gap-3 items-center mt-4">
            <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                {"<<"}
            </Button>
            <span>Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}</span>
            <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}>
                {">>"}
            </Button>
        </div>
    </div>
    )
  }
