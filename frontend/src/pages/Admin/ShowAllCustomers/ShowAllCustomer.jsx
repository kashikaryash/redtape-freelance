import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Chip,
    Avatar,
    IconButton,
    TextField,
    InputAdornment,
} from '@mui/material';
import {
    Search,
    Person,
    Email,
    Phone,
    Wc,
} from '@mui/icons-material';

const API_URL = 'http://localhost:8080/api';

const ShowAllCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios
            .get(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const filtered = response.data.filter(
                    (user) => user.role?.toLowerCase() !== 'admin'
                );
                setCustomers(filtered);
                setFilteredCustomers(filtered);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch customers');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCustomers(customers);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredCustomers(
                customers.filter(
                    (c) =>
                        c.name?.toLowerCase().includes(query) ||
                        c.email?.toLowerCase().includes(query) ||
                        c.mobile?.includes(query)
                )
            );
        }
    }, [searchQuery, customers]);

    const getGenderColor = (gender) => {
        switch (gender?.toLowerCase()) {
            case 'male':
                return '#3b82f6';
            case 'female':
                return '#ec4899';
            default:
                return '#8b5cf6';
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                }}
            >
                <CircularProgress sx={{ color: '#e63946' }} size={60} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: 'white',
                            textAlign: 'center',
                            mb: 1,
                        }}
                    >
                        Customer Management
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}
                    >
                        View and manage all registered customers
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Search Bar */}
                <Paper
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.95)',
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: '#e63946' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                    />
                </Paper>

                {/* Stats */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            flex: 1,
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #e63946 0%, #d62839 100%)',
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                            {customers.length}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            Total Customers
                        </Typography>
                    </Paper>
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            flex: 1,
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                            {customers.filter((c) => c.gender?.toLowerCase() === 'male').length}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>Male</Typography>
                    </Paper>
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            flex: 1,
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                            {customers.filter((c) => c.gender?.toLowerCase() === 'female').length}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>Female</Typography>
                    </Paper>
                </Box>

                {/* Table */}
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: 3,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                        overflow: 'hidden',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                                }}
                            >
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Customer</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Mobile</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Gender</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCustomers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography color="text.secondary">
                                            No customers found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <TableRow
                                        key={customer.id}
                                        sx={{
                                            '&:hover': { bgcolor: 'rgba(230,57,70,0.05)' },
                                            transition: 'background-color 0.2s',
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: getGenderColor(customer.gender),
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                >
                                                    {customer.name?.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography sx={{ fontWeight: 500 }}>
                                                    {customer.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Email sx={{ fontSize: 18, color: '#666' }} />
                                                {customer.email}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Phone sx={{ fontSize: 18, color: '#666' }} />
                                                {customer.mobile || 'N/A'}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={<Wc sx={{ fontSize: 16 }} />}
                                                label={customer.gender || 'N/A'}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${getGenderColor(customer.gender)}20`,
                                                    color: getGenderColor(customer.gender),
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={customer.role || 'USER'}
                                                size="small"
                                                sx={{
                                                    bgcolor: '#e6394620',
                                                    color: '#e63946',
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default ShowAllCustomers;
