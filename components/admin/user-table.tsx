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
import { UserDetailsDialog } from "@/components/admin/user-details-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup, faAngleDown, faAngleUp,faAnglesUpDown } from '@fortawesome/pro-solid-svg-icons';


const userData = [
    { user_id: 1, name: "John Doe", email: "john.doe@example.com", status: "Active", dateJoined: "2021-07-16", total_orders: 5, registered_date: "2021-07-01" },
    { user_id: 2, name: "Jane Smith", email: "jane.smith@example.com", status: "Inactive", dateJoined: "2020-04-25", total_orders: 2, registered_date: "2020-04-10" },
    { user_id: 3, name: "William Johnson", email: "william.johnson@example.com", status: "Active", dateJoined: "2022-01-30", total_orders: 8, registered_date: "2022-01-15" },
    { user_id: 4, name: "Olivia Brown", email: "olivia.brown@example.com", status: "Active", dateJoined: "2019-09-14", total_orders: 4, registered_date: "2019-09-01" },
    { user_id: 5, name: "Emily Clark", email: "emily.clark@example.com", status: "Inactive", dateJoined: "2021-11-05", total_orders: 3, registered_date: "2021-10-21" },
    { user_id: 6, name: "Michael Smith", email: "michael.smith@example.com", status: "Active", dateJoined: "2022-03-12", total_orders: 6, registered_date: "2022-02-28" },
    { user_id: 7, name: "Linda Johnson", email: "linda.johnson@example.com", status: "Inactive", dateJoined: "2020-11-23", total_orders: 1, registered_date: "2020-11-10" },
    { user_id: 8, name: "Robert Wilson", email: "robert.wilson@example.com", status: "Active", dateJoined: "2021-09-15", total_orders: 7, registered_date: "2021-09-01" },
    { user_id: 9, name: "Patricia Martinez", email: "patricia.martinez@example.com", status: "Inactive", dateJoined: "2019-12-20", total_orders: 2, registered_date: "2019-12-05" },
    { user_id: 10, name: "David Anderson", email: "david.anderson@example.com", status: "Active", dateJoined: "2023-01-22", total_orders: 9, registered_date: "2023-01-08" },
    { user_id: 11, name: "Elizabeth Taylor", email: "elizabeth.taylor@example.com", status: "Active", dateJoined: "2022-07-18", total_orders: 5, registered_date: "2022-07-04" },
    { user_id: 12, name: "Charles White", email: "charles.white@example.com", status: "Inactive", dateJoined: "2020-05-29", total_orders: 3, registered_date: "2020-05-15" },
    { user_id: 13, name: "Barbara Brown", email: "barbara.brown@example.com", status: "Active", dateJoined: "2021-10-14", total_orders: 4, registered_date: "2021-10-01" },
    { user_id: 14, name: "Jennifer Harris", email: "jennifer.harris@example.com", status: "Inactive", dateJoined: "2019-08-23", total_orders: 2, registered_date: "2019-08-09" },
    { user_id: 15, name: "Maria Garcia", email: "maria.garcia@example.com", status: "Active", dateJoined: "2022-06-11", total_orders: 8, registered_date: "2022-05-28" },
];
  
  const sortFunction = (a: { user_id: number }, b: { user_id: number }) => a.user_id - b.user_id;
  
  type UserKey = keyof typeof userData[number];

  
  export default function UserTable() {
    const [sortedData, setSortedData] = useState(userData);
    const [sortDirection, setSortDirection] = useState<{[key in UserKey]?: "asc" | "desc"}>({});
    const [isOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<typeof userData[number] | null>(null);
    const [tempSearchQuery, setTempSearchQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = (column: UserKey) => {
        const newDirection = sortDirection[column] === "asc" ? "desc" : "asc";
        const sorted = [...sortedData].sort((a, b) => {
        if (a[column] < b[column]) return newDirection === "asc" ? -1 : 1;
        if (a[column] > b[column]) return newDirection === "asc" ? 1 : -1;
        return 0;
        });
        setSortedData(sorted);
        setSortDirection({...sortDirection, [column]: newDirection});
    };
 
    const handleRowClick = (user: typeof userData[number]) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
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

    const filteredData = sortedData.filter((user) =>
        Object.values(user).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
    <div>
        <UserDetailsDialog user={selectedUser} open={isOpen} onOpenChange={setIsDialogOpen} />
        <form onSubmit={handleSearch} className="mb-4 flex justify-end space-x-2">
            <Input
                type="text"
                placeholder="Search users..."
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
                <TableHead className="w-[70px] sortable" data-sort="user_id" role="button" tabIndex={0} onClick={() => handleSort('user_id')}>
                    ID
                    {sortDirection['user_id'] ? (
                        sortDirection['user_id'] === 'asc' ? (
                            <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                        )
                    ) : (
                        <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
                    )}
                </TableHead>
                <TableHead className="sortable" data-sort="name" role="button" tabIndex={0} onClick={() => handleSort('name')}>
                    Name
                    {sortDirection['name'] ? (
                        sortDirection['name'] === 'asc' ? (
                            <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                        )
                    ) : (
                        <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1"/>
                    )}
                </TableHead>
                <TableHead className="sortable" data-sort="email" role="button" tabIndex={0} onClick={() => handleSort('email')}>
                    Email
                    {sortDirection['email'] ? (
                        sortDirection['email'] === 'asc' ? (
                            <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                        )
                    ) : (
                        <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
                    )}
                </TableHead>
                <TableHead className="text-right sortable" data-sort="total_orders" role="button" tabIndex={0} onClick={() => handleSort('total_orders')}>
                    Total Orders
                    {sortDirection['total_orders'] ? (
                        sortDirection['total_orders'] === 'asc' ? (
                            <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                        )
                    ) : (
                        <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
                    )}
                </TableHead>
                <TableHead className="text-right sortable" data-sort="registered_date" role="button" tabIndex={0} onClick={() => handleSort('registered_date')}>
                    Registered Date
                    {sortDirection['registered_date'] ? (
                        sortDirection['registered_date'] === 'asc' ? (
                            <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                        )
                    ) : (
                        <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1"/>
                    )}
                </TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {currentItems.map((user) => (
                <TableRow key={user.user_id} onClick={() => handleRowClick(user)} className="cursor-pointer">
                <TableCell className="font-medium">{user.user_id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right">{user.total_orders}</TableCell>
                <TableCell className="text-right">{user.registered_date}</TableCell>
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
