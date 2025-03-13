import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Simulating API authentication
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (email === "test@example.com" && password === "password123") {
            localStorage.setItem("token", "fake-token");
            navigate("/dashboard"); // ✅ Client-side navigation
        } else {
            setError("Invalid credentials");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ width: 320, margin: "auto", mt: 10, textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>Login</Typography>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <TextField fullWidth label="Email" name="email" variant="outlined" margin="normal" required />
                <TextField fullWidth label="Password" type="password" name="password" variant="outlined" margin="normal" required />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>
            </Box>
        </form>
    );
}

export default Login;
