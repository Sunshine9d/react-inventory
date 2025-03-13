import "./App.css";
import AppRoutes from "@app/routes";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Ensure global styles are loaded
// Create a new QueryClient instance
const queryClient = new QueryClient();
function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <AppRoutes />
            </QueryClientProvider>

        </>
    );
}

export default App;
