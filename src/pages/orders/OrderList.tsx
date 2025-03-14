import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../config/api/apiConfig";
import apiEndpoints from "../../config/api/apiEndpoints";
import {
    TextField,
    Pagination,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Skeleton,
    Typography,
} from "@mui/material";

const fetchOrders = async ({ queryKey }: { queryKey: [string, { limit: number; offset: number; customer_name: string }] }) => {
    const [_key, { limit, offset, customer_name }] = queryKey;

    const response = await apiClient.get(apiEndpoints.orders, {
        params: { limit, offset, customer_name },
    });

    return response.data;
};

export default function OrderList() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [showSkeleton, setShowSkeleton] = useState(false);

    // Debounce search input (wait 500ms before updating `debouncedSearch`)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Start a timer to show Skeleton only when fetch time exceeds 100ms
    useEffect(() => {
        const timer = setTimeout(() => setShowSkeleton(true), 100);
        return () => clearTimeout(timer);
    }, [page, debouncedSearch]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["orders", { limit: 10, offset: (page - 1) * 10, customer_name: debouncedSearch }],
        queryFn: fetchOrders,
        keepPreviousData: true,
        onSuccess: () => setShowSkeleton(false), // Hide skeleton when data is ready
    });

    return (
        <Paper sx={{ p: 2, minWidth: 650 }}>
            {/* Search Input */}
            <TextField
                label="Search Orders"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Loading State with 100ms delay before showing Skeleton */}
            {isLoading && showSkeleton ? (
                <TableContainer>
                    <Table sx={{ width: 650, minWidth: 650 }} aria-label="orders table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Order ID</TableCell>
                                <TableCell align="right">Customer Name</TableCell>
                                <TableCell align="right">Total Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...Array(10)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell align="right">
                                        <Skeleton variant="text" width={60} height={20} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Skeleton variant="text" width="60%" height={20} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : error ? (
                <Typography color="error">Error loading orders</Typography>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell >Total Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(data?.orders || []).map((order: { id: number; customer_name: string, total_price: number }) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.customer_name}</TableCell>
                                        <TableCell>{order.total_price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Pagination
                        count={data?.totalPages ?? 1}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                    />
                </>
            )}
        </Paper>
    );
}
