import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  AddCircle,
  Inventory,
  Palette,
  Numbers,
  AttachMoney,
  Description,
  CheckCircle,
  CloudUpload,
  Delete,
} from '@mui/icons-material';

const API_URL = 'https://steadfast-rejoicing-production.up.railway.app/api';

const AddProductForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    color: '',
    quantity: '',
    price: '',
    category: '',
    subCategory: '',
    description: '',
  });

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });

  const [previews, setPreviews] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });

  const subcategories = {
    MEN: ['BOOTS', 'CASUAL', 'FORMALSHOES', 'SLIDERS', 'SPORTSSHOES'],
    WOMEN: ['CASUAL', 'SLIDERS', 'SPORTSSHOES'],
    KIDS: ['CASUAL', 'SPORTSSHOES'],
  };

  const subcategoryLabels = {
    BOOTS: 'Boots',
    CASUAL: 'Casual',
    FORMALSHOES: 'Formal Shoes',
    SLIDERS: 'Sliders/Flip Flops',
    SPORTSSHOES: 'Sports Shoes',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category,
      subCategory: '',
    }));
  };

  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImages((prev) => ({ ...prev, [imageKey]: file }));
      setPreviews((prev) => ({ ...prev, [imageKey]: URL.createObjectURL(file) }));
    }
  };

  const removeImage = (imageKey) => {
    setImages((prev) => ({ ...prev, [imageKey]: null }));
    setPreviews((prev) => ({ ...prev, [imageKey]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      setError('Please enter a valid positive number for Quantity.');
      setLoading(false);
      return;
    }
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setError('Please enter a valid positive number for Price.');
      setLoading(false);
      return;
    }
    if (!images.image1) {
      setError('At least one image (Main Image) is required.');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('color', formData.color.trim());
    formDataToSend.append('quantity', Number(formData.quantity));
    formDataToSend.append('price', Number(formData.price));
    formDataToSend.append('category', formData.category);
    if (formData.subCategory) {
      formDataToSend.append('subCategory', formData.subCategory);
    }
    formDataToSend.append('description', formData.description.trim());

    // Append images
    if (images.image1) formDataToSend.append('image1', images.image1);
    if (images.image2) formDataToSend.append('image2', images.image2);
    if (images.image3) formDataToSend.append('image3', images.image3);
    if (images.image4) formDataToSend.append('image4', images.image4);
    if (images.image5) formDataToSend.append('image5', images.image5);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const text = await response.text();
        setError(`Failed to submit product: ${response.status}`);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/products'), 2000);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Error submitting product');
      setLoading(false);
    }
  };

  if (success) {
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
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Product Added!
          </Typography>
          <Typography color="text.secondary">Redirecting to products...</Typography>
        </Paper>
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
      <Container maxWidth="md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #e63946 0%, #d62839 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 10px 40px rgba(230,57,70,0.4)',
              }}
            >
              <AddCircle sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
              Add New Product
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Add a new shoe to your SOLECRAFT collection
            </Typography>
          </Box>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Info */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a1a2e' }}>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Inventory sx={{ color: '#e63946' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Palette sx={{ color: '#e63946' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Numbers sx={{ color: '#e63946' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Price (₹)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney sx={{ color: '#e63946' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Category */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 2, color: '#1a1a2e' }}>
                    Category
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      label="Category"
                    >
                      {Object.keys(subcategories).map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {formData.category && subcategories[formData.category]?.length > 0 && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Sub Category</InputLabel>
                      <Select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        label="Sub Category"
                      >
                        {subcategories[formData.category].map((sub) => (
                          <MenuItem key={sub} value={sub}>
                            {subcategoryLabels[sub]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {/* Description */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description sx={{ color: '#e63946' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Images */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 2, color: '#1a1a2e' }}>
                    Product Images (Upload Files)
                  </Typography>
                </Grid>

                {[1, 2, 3, 4, 5].map((num) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={num}>
                    <Box
                      sx={{
                        border: '2px dashed',
                        borderColor: previews[`image${num}`] ? '#4caf50' : '#ccc',
                        borderRadius: 2,
                        p: 2,
                        textAlign: 'center',
                        position: 'relative',
                        minHeight: 150,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: previews[`image${num}`] ? 'rgba(76,175,80,0.1)' : 'transparent',
                      }}
                    >
                      {previews[`image${num}`] ? (
                        <>
                          <img
                            src={previews[`image${num}`]}
                            alt={`Preview ${num}`}
                            style={{
                              maxWidth: '100%',
                              maxHeight: 100,
                              objectFit: 'contain',
                              borderRadius: 8,
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(`image${num}`)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'rgba(255,0,0,0.1)',
                            }}
                          >
                            <Delete fontSize="small" color="error" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <CloudUpload sx={{ fontSize: 40, color: num === 1 ? '#e63946' : '#999', mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {num === 1 ? 'Main Image *' : `Image ${num}`}
                          </Typography>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, `image${num}`)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}

                {/* Submit */}
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #e63946 0%, #d62839 100%)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #d62839 0%, #c1252e 100%)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add Product'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AddProductForm;
