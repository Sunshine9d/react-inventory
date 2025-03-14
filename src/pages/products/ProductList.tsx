import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../config/api/apiConfig";
import apiEndpoints from "../../config/api/apiEndpoints";
import {
    TextField,
    Pagination,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Skeleton,
    Typography,
} from "@mui/material";

const fetchInventory = async ({ queryKey }: { queryKey: [string, { limit: number; offset: number; name: string }] }) => {
    const [_key, { limit, offset, name }] = queryKey;
    const response = await apiClient.get(apiEndpoints.products, {
        params: { limit, offset, name },
    });
    return response.data;
};

export default function ProductList() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [showSkeleton, setShowSkeleton] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 200);
        return () => clearTimeout(handler);
    }, [search]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["inventory", { limit: 10, offset: (page - 1) * 10, name: debouncedSearch }],
        queryFn: fetchInventory,
        keepPreviousData: false,
    });

    // Show skeleton only if loading lasts more than 100ms
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isLoading) {
            timeout = setTimeout(() => setShowSkeleton(true), 150);
        } else {
            setShowSkeleton(false);
        }
        return () => clearTimeout(timeout);
    }, [isLoading]);

    return (
        <Paper sx={{ p: 2, minWidth: 650 }}>
            {/* Search Input */}
            <TextField
                label="Search Products"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Skeleton Loader - Only Appears If Loading Takes >100ms */}
            {showSkeleton && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                    <Skeleton width="70%" />
                </Typography>
            )}

            {/* Error State */}
            {error && <Typography color="error">Error loading inventory</Typography>}

            {/* Only Render Table When Data is Available */}
            {!isLoading && !error && data && (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.products?.length > 0 ? (
                                    data.products.map((item: { id: number; name: string }) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} align="center">
                                            No products found
                                        </TableCell>
                                    </TableRow>
                                )}
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
