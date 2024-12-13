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

type Order = {
    id: string;
    customer_name: string;
    total: number;
    date: string;
    status: 'pending' | 'shipped' | 'delivered' | 'canceled';
    // Add any other order properties you need
  };

  const orderData: Order[] = [
    { id: '1', customer_name: 'John Doe', total: 100.00, date: '2022-01-01', status: 'pending' },
    { id: '2', customer_name: 'Jane Doe', total: 200.00, date: '2022-01-02', status: 'shipped' },
    { id: '3', customer_name: 'John Smith', total: 300.00, date: '2022-01-03', status: 'delivered' },
    { id: '4', customer_name: 'John Smith', total: 400.00, date: '2022-01-04', status: 'canceled' },
    { id: '5', customer_name: 'John Smith', total: 500.00, date: '2022-01-05', status: 'pending' },
    { id: '6', customer_name: 'John Smith', total: 600.00, date: '2022-01-06', status: 'shipped' },
    { id: '7', customer_name: 'John Smith', total: 700.00, date: '2022-01-07', status: 'delivered' },
    { id: '8', customer_name: 'John Smith', total: 800.00, date: '2022-01-08', status: 'canceled' },
    { id: '9', customer_name: 'John Smith', total: 900.00, date: '2022-01-09', status: 'pending' },
    { id: '10', customer_name: 'John Smith', total: 1000.00, date: '2022-01-10', status: 'shipped' },
  ];

  type OrderKey = keyof typeof orderData[number];

  
  export default function OrdersTable() {
    const [sortedData, setSortedData] = useState(orderData);
    const [sortDirection, setSortDirection] = useState<{[key in OrderKey]?: "asc" | "desc"}>({});
    const [isOpen, setIsDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(orderData[0]);
    const [tempSearchQuery, setTempSearchQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = (column: OrderKey) => {
        const newDirection = sortDirection[column] === "asc" ? "desc" : "asc";
        const sorted = [...sortedData].sort((a, b) => {
        if (a[column] < b[column]) return newDirection === "asc" ? -1 : 1;
        if (a[column] > b[column]) return newDirection === "asc" ? 1 : -1;
        return 0;
        });
        setSortedData(sorted);
        setSortDirection({...sortDirection, [column]: newDirection});
    };
 
    const handleRowClick = (order: typeof orderData[number]) => {
        setSelectedOrder(order);
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

    const filteredData = sortedData.filter((customer) =>
        Object.values(customer).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
    <div>
        <OrderDetailsDialog order={selectedOrder} open={isOpen} onOpenChange={setIsDialogOpen} />
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
                <TableHead className="w-[150px] text-left sortable" data-sort="date" role="button" tabIndex={0} onClick={() => handleSort('date')}>
                    Date
                    {sortDirection['date'] ? (
                        sortDirection['date'] === 'asc' ? (
                            <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                        )
                    ) : (
                        <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
                    )}
                </TableHead>
                <TableHead className="sortable" data-sort="customer_name" role="button" tabIndex={0} onClick={() => handleSort('customer_name')}>
                    Name
                    {sortDirection['customer_name'] ? (
                        sortDirection['customer_name'] === 'asc' ? (
                            <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                        )
                    ) : (
                        <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1"/>
                    )}
                </TableHead>
                <TableHead className="w-[100px] sortable" data-sort="total" role="button" tabIndex={0} onClick={() => handleSort('total')}>
                    Total
                    {sortDirection['total'] ? (
                        sortDirection['total'] === 'asc' ? (
                            <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                        )
                    ) : (
                        <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
                    )}
                </TableHead>
                <TableHead className="w-[100px] text-right sortable" data-sort="total" role="button" tabIndex={0} onClick={() => handleSort('total')}>
                    Total
                    {sortDirection['total'] ? (
                        sortDirection['status'] === 'asc' ? (
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
            {currentItems.map((order) => (
                <TableRow key={order.id} onClick={() => handleRowClick(order)} className="cursor-pointer">
                <TableCell className="text-left">{order.date}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">{order.status}</TableCell>
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
