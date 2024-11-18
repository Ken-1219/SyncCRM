"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid2,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import { toast } from "react-hot-toast";

const AddOrderModal = ({ open, onClose, customerId, order, onOrderSaved }) => {
  const [orderData, setOrderData] = useState({
    items: [{ productName: "", quantity: 1, price: 0 }],
    comments: "",
    status: "Pending",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (order) {
      setOrderData(order);
    } else {
      setOrderData({
        items: [{ productName: "", quantity: 1, price: 0 }],
        comments: "",
        status: "Pending",
      });
    }
  }, [order]);

  const handleItemChange = (index, field, value) => {
    const items = [...orderData.items];
    items[index][field] = value;
    setOrderData({ ...orderData, items });
  };

  const handleAddItem = () => {
    setOrderData({
      ...orderData,
      items: [...orderData.items, { productName: "", quantity: 1, price: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    const items = orderData.items.filter((_, i) => i !== index);
    setOrderData({ ...orderData, items });
  };

  const calculateTotal = () => {
    return orderData.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  const validateOrder = () => {
    if (orderData.items.length === 0) {
      toast.error("Order must have at least one item.");
      return false;
    }
    for (const item of orderData.items) {
      if (!item.productName || item.quantity <= 0 || item.price <= 0) {
        toast.error(
          "All items must have valid product name, quantity, and price."
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateOrder()) return;

    try {
      if (order) {
        // Edit order
        const response = await axios.put(
          `${API_URL}/api/orders/updateOrder/${order._id}`,
          orderData
        );
        toast.success("Order updated successfully!");
        onOrderSaved(response.data.order);
      } else {
        // Add new order
        const response = await axios.post(`${API_URL}/api/orders/createOrder`, {
          customerId,
          ...orderData,
        });
        toast.success("Order added successfully!");
        onOrderSaved(response.data.order);
      }
      setOrderData({
        items: [{ productName: "", quantity: 1, price: 0 }],
        comments: "",
        status: "Pending",
      });
      onClose();
    } catch (error) {
      console.error("Failed to save order:", error);
      toast.error("Failed to save order.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          maxWidth: 600,
          mx: "auto",
          mt: 8,
          background: "#fff",
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" mb={2}>
          {order ? "Edit Order" : "Add Order"}
        </Typography>
        <Grid2 container spacing={2}>
          {orderData.items.map((item, index) => (
            <Grid2 container spacing={1} key={index} alignItems="center">
              <Grid2 xs={5}>
                <TextField
                  label="Product Name"
                  value={item.productName}
                  onChange={(e) =>
                    handleItemChange(index, "productName", e.target.value)
                  }
                  fullWidth
                  required
                />
              </Grid2>
              <Grid2 xs={2}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", Number(e.target.value))
                  }
                  fullWidth
                  required
                />
              </Grid2>
              <Grid2 xs={3}>
                <TextField
                  label="Price"
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", Number(e.target.value))
                  }
                  fullWidth
                  required
                />
              </Grid2>
              <Grid2 xs={2}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveItem(index)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Grid2>
            </Grid2>
          ))}
          <Grid2 xs={12} display="flex" justifyContent="flex-end">
            <IconButton color="primary" onClick={handleAddItem}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Grid2>
          <Grid2 xs={12}>
            <TextField
              label="Comments"
              multiline
              rows={2}
              fullWidth
              value={orderData.comments}
              onChange={(e) =>
                setOrderData({ ...orderData, comments: e.target.value })
              }
            />
          </Grid2>
          <Grid2 xs={12}>
            <TextField
              label="Status"
              select
              SelectProps={{ native: true }}
              value={orderData.status}
              onChange={(e) =>
                setOrderData({ ...orderData, status: e.target.value })
              }
              fullWidth
            >
              {["Pending", "Completed", "Cancelled"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </TextField>
          </Grid2>
          <Grid2 xs={12}>
            <Typography variant="subtitle1" align="right">
              <strong>Total:</strong> ₹{calculateTotal()}
            </Typography>
          </Grid2>
        </Grid2>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {order ? "Update Order" : "Create Order"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddOrderModal;
