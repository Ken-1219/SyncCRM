import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Grid2,
} from "@mui/material";
import Loader from "../Loader";

const AddCustomerModal = ({ open, onClose, onSubmit, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateFields = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!formData.address.street.trim())
      newErrors["address.street"] = "Street is required.";
    if (!formData.address.city.trim())
      newErrors["address.city"] = "City is required.";
    if (!formData.address.state.trim())
      newErrors["address.state"] = "State is required.";
    if (!formData.address.zip.trim() || !/^\d{5,6}$/.test(formData.address.zip))
      newErrors["address.zip"] = "Enter a valid ZIP code.";
    if (!formData.address.country.trim())
      newErrors["address.country"] = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (validateFields()) {
        await onSubmit(formData);
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: { street: "", city: "", state: "", zip: "", country: "" },
        });
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: { street: "", city: "", state: "", zip: "", country: "" },
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "70%", md: "60%" },
          maxHeight: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          p: 4,
          boxShadow: 24,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight={"bold"} mb={2}>
          {initialData ? "Edit Customer" : "Add Customer"}
        </Typography>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
          required
        />
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          margin="normal"
          error={!!errors.phone}
          helperText={errors.phone}
          required
        />
        <Typography variant="subtitle1" mt={2} mb={1}>
          Address
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 md={6} xs={12}>
            <TextField
              fullWidth
              label="Street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              margin="normal"
              error={!!errors["address.street"]}
              helperText={errors["address.street"]}
              required
            />
          </Grid2>
          <Grid2 md={4} xs={12}>
            <TextField
              fullWidth
              label="City"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              margin="normal"
              error={!!errors["address.city"]}
              helperText={errors["address.city"]}
              required
            />
          </Grid2>
          <Grid2 md={4} xs={12}>
            <TextField
              fullWidth
              label="State"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              margin="normal"
              error={!!errors["address.state"]}
              helperText={errors["address.state"]}
              required
            />
          </Grid2>
          <Grid2 md={4} xs={12}>
            <TextField
              fullWidth
              label="ZIP Code"
              name="address.zip"
              value={formData.address.zip}
              onChange={handleChange}
              margin="normal"
              error={!!errors["address.zip"]}
              helperText={errors["address.zip"]}
              required
            />
          </Grid2>
          <Grid2 xs={12}>
            <TextField
              fullWidth
              label="Country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              margin="normal"
              error={!!errors["address.country"]}
              helperText={errors["address.country"]}
              required
            />
          </Grid2>
        </Grid2>
        <Box
          mt={2}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              color: "#4A90E2",
              borderColor: "#4A90E2",
              "&:hover": {
                borderColor: "#357ABD",
                color: "#357ABD",
              },
              fontWeight: "bold",
            }}
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader size={20} />
            ) : initialData ? (
              "Update Customer"
            ) : (
              "Add Customer"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCustomerModal;
