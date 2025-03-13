import { useQuery } from "@tanstack/react-query";
import apiClient from "@config/api/apiConfig";
import apiEndpoints from "@config/api/apiEndpoints";
import { CircularProgress, Typography } from "@mui/material";

const fetchInventory = async ({ queryKey }: { queryKey: [string, { limit: number; offset: number }] }) => {
    const [_key, { limit, offset }] = queryKey;

    const response = await apiClient.get(`${apiEndpoints.products}/1`, {
        params: { limit, offset },
    });

    return [response.data];
};

function InventoryList() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["inventory", { limit: 10, offset: 0 }],
        queryFn: fetchInventory,
    });

    if (isLoading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    if (error) return <Typography color="error">Error loading inventory</Typography>;

    return (
        <div>
            <h1>Inventory List</h1>
            <ul>
                {data.map((item: { id: number; name: string }) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default InventoryList;
