import React, { useState, useEffect, useRef } from 'react';
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Autocomplete,
} from '@mui/material';
import {
  Search,
  Delete,
  Edit,
  FilterList,
  Inventory,
} from '@mui/icons-material';

const API_URL = 'http://localhost:8080/api';

const ShowAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubCategory, setFilterSubCategory] = useState('');
  const [searchName, setSearchName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedModelNos, setSelectedModelNos] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const searchTimeout = useRef(null);

  const fetchProducts = async (category = '', subCategory = '') => {
    try {
      let url = `${API_URL}/products`;
      const res = await axios.get(url);
      let data = res.data || [];

      if (category) {
        data = data.filter((p) => p.category === category);
      }
      if (subCategory) {
        data = data.filter((p) => p.subCategory === subCategory);
      }

      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!value.trim()) {
      setSuggestions([]);
      fetchProducts(filterCategory, filterSubCategory);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      const filtered = products.filter((p) =>
        p.name?.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.map((p) => p.name).slice(0, 5));
    }, 300);
  };

  const handleSearch = (query) => {
    if (!query?.trim()) {
      fetchProducts(filterCategory, filterSubCategory);
      return;
    }

    const filtered = products.filter((p) =>
      p.name?.toLowerCase().includes(query.toLowerCase())
    );
    setProducts(filtered);
    setSuggestions([]);
  };

  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setFilterCategory(category);
    fetchProducts(category, filterSubCategory);
  };

  const handleSubCategoryFilter = (e) => {
    const subCategory = e.target.value;
    setFilterSubCategory(subCategory);
    fetchProducts(filterCategory, subCategory);
  };

  const handleCheckboxChange = (modelNo) => {
    setSelectedModelNos((prev) =>
      prev.includes(modelNo) ? prev.filter((id) => id !== modelNo) : [...prev, modelNo]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedModelNos(products.map((p) => p.modelNo));
    } else {
      setSelectedModelNos([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedModelNos.length === 0) return;
    if (!window.confirm('Are you sure you want to delete selected products?')) return;

    const token = localStorage.getItem('token');
    try {
      await Promise.all(
        selectedModelNos.map((modelNo) =>
          axios.delete(`${API_URL}/products/${modelNo}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setSelectedModelNos([]);
      fetchProducts(filterCategory, filterSubCategory);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct({ ...product });
    setEditDialogOpen(true);
  };

  const saveEditedProduct = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_URL}/products/${editProduct.modelNo}`, editProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditDialogOpen(false);
      setEditProduct(null);
      fetchProducts(filterCategory, filterSubCategory);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: 'white', textAlign: 'center', mb: 1 }}
          >
            Product Management
          </Typography>
          <Typography
            sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}
          >
            Manage your entire product catalog
          </Typography>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Search by Name"
                value={searchName}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchName)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#e63946' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={handleCategoryFilter}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="MEN">Men</MenuItem>
                  <MenuItem value="WOMEN">Women</MenuItem>
                  <MenuItem value="KIDS">Kids</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>SubCategory</InputLabel>
                <Select
                  value={filterSubCategory}
                  onChange={handleSubCategoryFilter}
                  label="SubCategory"
                >
                  <MenuItem value="">All SubCategories</MenuItem>
                  <MenuItem value="BOOTS">Boots</MenuItem>
                  <MenuItem value="CASUAL">Casual</MenuItem>
                  <MenuItem value="FORMALSHOES">Formal Shoes</MenuItem>
                  <MenuItem value="SLIDERS">Sliders</MenuItem>
                  <MenuItem value="SPORTSSHOES">Sports Shoes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleSearch(searchName)}
                sx={{
                  py: 1.8,
                  bgcolor: '#e63946',
                  '&:hover': { bgcolor: '#d62839' },
                }}
              >
                Search
              </Button>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              {selectedModelNos.length > 0 && (
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDeleteSelected}
                  sx={{ py: 1.8 }}
                >
                  Delete ({selectedModelNos.length})
                </Button>
              )}
            </Grid>
          </Grid>
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
              {products.length}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>Total Products</Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              flex: 1,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              {products.filter((p) => p.category === 'MEN').length}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>Men's</Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              flex: 1,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              {products.filter((p) => p.category === 'WOMEN').length}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>Women's</Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              flex: 1,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              {products.filter((p) => p.category === 'KIDS').length}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>Kids</Typography>
          </Paper>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedModelNos.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                    sx={{ color: 'white', '&.Mui-checked': { color: '#e63946' } }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Qty</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Images</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Inventory sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                    <Typography color="text.secondary">No products found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((prod) => (
                  <TableRow
                    key={prod.modelNo}
                    sx={{ '&:hover': { bgcolor: 'rgba(230,57,70,0.05)' } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedModelNos.includes(prod.modelNo)}
                        onChange={() => handleCheckboxChange(prod.modelNo)}
                        sx={{ '&.Mui-checked': { color: '#e63946' } }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={prod.img1}
                          variant="rounded"
                          sx={{ width: 50, height: 50 }}
                        >
                          <Inventory />
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 500 }}>{prod.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            #{prod.modelNo}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={prod.category} size="small" sx={{ mr: 0.5 }} />
                      <Chip
                        label={prod.subCategory}
                        size="small"
                        variant="outlined"
                        sx={{ color: '#e63946', borderColor: '#e63946' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: '#e63946' }}>
                        ₹{prod.price?.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{prod.quantity}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[prod.img1, prod.img2, prod.img3].filter(Boolean).map((img, i) => (
                          <Avatar
                            key={i}
                            src={img}
                            variant="rounded"
                            sx={{ width: 30, height: 30 }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEditProduct(prod)}
                        sx={{ color: '#e63946' }}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>Edit Product</DialogTitle>
          <DialogContent>
            {editProduct && (
              <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Name"
                  value={editProduct.name || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Price"
                  type="number"
                  value={editProduct.price || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                  fullWidth
                />
                <TextField
                  label="Quantity"
                  type="number"
                  value={editProduct.quantity || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, quantity: Number(e.target.value) })}
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={editProduct.description || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={saveEditedProduct}
              sx={{ bgcolor: '#e63946', '&:hover': { bgcolor: '#d62839' } }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ShowAllProducts;