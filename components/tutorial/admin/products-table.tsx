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
import { ProductWithPrice } from "@/models/local/types";
import { ProductDetailsDialog } from "./product-details-dialog";

  const productData: ProductWithPrice[] = [
    { id: '1', active: true, 
    name: 'Basic', 
    description: 'Basic description', 
    image: 'https://via.placeholder.com/150', 
    metadata: {}, prices: [
        { 
          id: '1', 
          active: true, 
          type: 'recurring', 
          unit_amount: 10000, 
          currency: 'usd', 
          interval: 'month', 
          interval_count: 1,
          description: null, // Added as null
          metadata: {}, // Added as an empty object
          product_id: null, // Added as null
          trial_period_days: null // Added as null
        }
      ]},
    { id: '2', active: true, name: 'Pro', description: 'Pro description', image: 'https://via.placeholder.com/150', metadata: {}, prices: [
        { 
          id: '2', 
          active: true, 
          type: 'recurring', 
          unit_amount: 20000, 
          currency: 'usd', 
          interval: 'month', 
          interval_count: 1,
          description: null, // Added as null
          metadata: {}, // Added as an empty object
          product_id: null, // Added as null
          trial_period_days: null // Added as null
        }
      ]},
    { id: '3', active: true, name: 'Premium', description: 'Premium description', image: 'https://via.placeholder.com/150', metadata: {}, prices: [
        { 
          id: '3', 
          active: true, 
          type: 'recurring', 
          unit_amount: 30000, 
          currency: 'usd', 
          interval: 'month', 
          interval_count: 1,
          description: null, // Added as null
          metadata: {}, // Added as an empty object
          product_id: null, // Added as null
          trial_period_days: null // Added as null
        }
      ]},
  ];
  
  const sortFunction = (a: { customer_id: number }, b: { customer_id: number }) => a.customer_id - b.customer_id;
  
  type ProductKey = keyof typeof productData[number];

  
  export default function ProductsTable() {
    const [sortedData, setSortedData] = useState(productData);
    const [sortDirection, setSortDirection] = useState<{[key: string]: "asc" | "desc"}>({});
    const [isOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<typeof productData[number] | null>(null);
    const [tempSearchQuery, setTempSearchQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Adjust the sorting function to accept the column key as a parameter
    const sortProducts = (sortedData: ProductWithPrice[], column: keyof ProductWithPrice | 'type' | 'price', newDirection: "asc" | "desc") => {
        return [...sortedData].sort((a, b) => {
            let valueA: string | number;
            let valueB: string | number;
    
            if (column === 'type') {
                // Assuming 'type' refers to the type of the first price in the prices array
                valueA = a.prices?.[0]?.type ?? '';
                valueB = b.prices?.[0]?.type ?? '';
            } else if (column === 'price') {
                // Assuming 'price' refers to the unitAmount of the first price in the prices array
                valueA = a.prices?.[0]?.unit_amount ?? 0;
                valueB = b.prices?.[0]?.unit_amount ?? 0;
            } else {
                valueA = a[column] as string | number;
                valueB = b[column] as string | number;
            }
    
            if (valueA < valueB) return newDirection === "asc" ? -1 : 1;
            if (valueA > valueB) return newDirection === "asc" ? 1 : -1;
            return 0;
        });
    };
 
    const handleRowClick = (product: typeof productData[number]) => {
        setSelectedProduct(product);
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
            typeof value === 'string' || typeof value === 'number' ? value.toString().toLowerCase().includes(searchQuery.toLowerCase()) : false

    ));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
    <div>
        <ProductDetailsDialog product={selectedProduct} open={isOpen} onOpenChange={setIsDialogOpen} />
        <form onSubmit={handleSearch} className="mb-4 flex justify-end space-x-2">
            <Input
                type="text"
                placeholder="Search products..."
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
                <TableHead className="sortable" data-sort="name" role="button" tabIndex={0} onClick={() => sortProducts(productData, 'name', 'asc')}>
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
                <TableHead className="sortable" data-sort="type" role="button" tabIndex={0} onClick={() => sortProducts(productData, 'type', 'asc')}>
                    Type
                    {sortDirection['type'] ? (
                        sortDirection['type'] === 'asc' ? (
                            <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                        )
                    ) : (
                        <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
                    )}
                </TableHead>
                <TableHead className="text-right sortable" data-sort="price" role="button" tabIndex={0} onClick={() => sortProducts(productData, 'price', 'asc')}>
                    Price
                    {sortDirection['price'] ? (
                        sortDirection['price'] === 'asc' ? (
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
            {currentItems.map((product) => (
                <TableRow key={product.id} onClick={() => handleRowClick(product)} className="cursor-pointer">
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.prices?.[0]?.type}</TableCell>
                <TableCell className="text-right">${product.prices?.[0]?.unit_amount?.toFixed(2)}</TableCell>
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
