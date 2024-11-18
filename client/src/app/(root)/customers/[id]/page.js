"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid2,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import AddCustomerModal from "@/app/components/customers/AddCustomerCard";
import AddOrderModal from "@/app/components/orders/AddOrderModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";

const CustomerDetailPage = () => {
  const router = useRouter();
  const slug = useParams()?.id;
  const id = slug.split("-").pop();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (id) {
      fetchCustomerDetails(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCustomerDetails = async (customerId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/customers/${customerId}`
      );
      setCustomer(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching customer details:", err);
      setError("Failed to fetch customer details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (updatedData) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/customers/updateCustomer/${id}`,
        updatedData,
        { headers: { "Content-Type": "application/json" } }
      );
      setCustomer(response.data.customer);
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Failed to update customer details. Please try again.");
    }
  };

  const handleOrderSaved = (savedOrder) => {
    if (editingOrder) {
      const updatedOrders = customer.orders.map((order) =>
        order._id === savedOrder._id ? savedOrder : order
      );
      setCustomer((prev) => ({
        ...prev,
        orders: updatedOrders,
        totalSpending:
          prev.totalSpending -
          customer.orders.find((order) => order._id === savedOrder._id)
            .totalAmount +
          savedOrder.totalAmount,
      }));
    } else {
      setCustomer((prev) => ({
        ...prev,
        orders: [...prev.orders, savedOrder],
        totalSpending: prev.totalSpending + savedOrder.totalAmount,
      }));
    }
    setOrderModalOpen(false);
    setEditingOrder(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Loader size={50} fullScreen />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/customers")}
          sx={{
            mt: 2,
            backgroundColor: "#4A90E2",
            "&:hover": { backgroundColor: "#357ABD" },
          }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Customer not found.</Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/customers")}
          sx={{
            mt: 2,
            backgroundColor: "#4A90E2",
            "&:hover": { backgroundColor: "#357ABD" },
          }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`${API_URL}/api/orders/${orderId}`);
      setCustomer((prev) => ({
        ...prev,
        orders: prev.orders.filter((order) => order._id !== orderId),
        totalSpending:
          prev.totalSpending -
          prev.orders.find((order) => order._id === orderId).totalAmount,
      }));
      toast.success("Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          padding: 2,
          borderRadius: "8px",
          background: "linear-gradient(135deg, #f3e7e9, #e3eeff)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              fontSize: 48,
              marginRight: 3,
              background: "linear-gradient(135deg, #4A90E2, #E94E77)",
              boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
            }}
          >
            {customer.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {customer.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {customer.email}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {customer.phone}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{
            mt: { xs: 2, md: 0 },
            backgroundColor: "#4A90E2",
            color: "#fff",
            fontWeight: "bold",
            height: 40,
            "&:hover": { backgroundColor: "#357ABD" },
          }}
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      </Box>

      <Grid2 container spacing={3} mb={4}>
        <Grid2 xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #e3eeff, #ffffff)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#4A90E2" }}
              >
                Customer Summary
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  label={`Total Spending: ₹${customer.totalSpending}`}
                  sx={{
                    backgroundColor: "#E5F2FF",
                    color: "#4A90E2",
                    fontWeight: "bold",
                  }}
                />
                <Chip
                  label={`Visits: ${customer.visits}`}
                  sx={{
                    backgroundColor: "#E5F2FF",
                    color: "#4A90E2",
                    fontWeight: "bold",
                  }}
                />
                <Chip
                  label={`Last Visit: ${
                    customer.lastVisitDate
                      ? new Date(customer.lastVisitDate).toLocaleDateString()
                      : "N/A"
                  }`}
                  sx={{
                    backgroundColor: "#E5F2FF",
                    color: "#4A90E2",
                    fontWeight: "bold",
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #e3eeff, #ffffff)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#4A90E2" }}
              >
                Address
              </Typography>
              <Typography
                sx={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  color: "#4A4A4A",
                  fontSize: "16px",
                }}
              >
                {`${customer.address.street}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zip}, ${customer.address.country}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Typography
        variant="h5"
        mb={2}
        fontWeight="bold"
        sx={{ color: "#4A90E2" }}
      >
        Purchase History
      </Typography>
      <Paper
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: "8px",
          padding: 2,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#4A4A4A" }}>
            Orders
          </Typography>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            variant="contained"
            sx={{
              backgroundColor: "#4A90E2",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#357ABD" },
            }}
            onClick={() => setOrderModalOpen(true)}
          >
            Add Order
          </Button>
        </Box>
        {customer.orders.length > 0 ? (
          <Table>
            <TableHead sx={{ backgroundColor: "#E5D9F2", textAlign: "center" }}>
              <TableRow sx={{ textAlign: "center" }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customer.orders.map((order) => (
                <TableRow
                  key={order._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#F5EFFF",
                    },
                  }}
                >
                  <TableCell>{order._id}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>₹{order.totalAmount}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      sx={{
                        color:
                          order.status === "Completed"
                            ? "#388e3ca1"
                            : order.status === "Cancelled"
                            ? "#d32f2fb5"
                            : "#f57b00a8",
                        backgroundColor:
                          order.status === "Completed"
                            ? "rgba(200, 230, 201, 0.3)"
                            : order.status === "Cancelled"
                            ? "rgba(255, 205, 210, 0.3)"
                            : "rgba(255, 224, 178, 0.3)",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        textAlign: "center",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center",
                      }}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditingOrder(order);
                          setOrderModalOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteOrder(order._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography
            variant="body1"
            sx={{
              padding: "16px",
              borderRadius: "8px",
              textAlign: "center",
              color: "#757575",
            }}
          >
            No orders found.
          </Typography>
        )}
      </Paper>

      <Typography
        variant="h5"
        mt={4}
        mb={2}
        fontWeight="bold"
        sx={{ color: "#4A90E2" }}
      >
        Campaign Engagement
      </Typography>
      <Paper elevation={3} sx={{ borderRadius: "8px", overflow: "auto" }}>
        {customer.campaignEngagements.length > 0 ? (
          <Table>
            <TableHead sx={{ backgroundColor: "#E5D9F2" }}>
              <TableRow>
                <TableCell>Campaign Name</TableCell>
                <TableCell>Date Sent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Opens</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customer.campaignEngagements.map((campaign, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#F5EFFF",
                    },
                  }}
                >
                  <TableCell>{campaign.campaignName}</TableCell>
                  <TableCell>
                    {new Date(campaign.dateSent).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>{campaign.engagementMetrics.clicks}</TableCell>
                  <TableCell>{campaign.engagementMetrics.opens}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography
            variant="body1"
            sx={{
              padding: "16px",
              borderRadius: "8px",
              textAlign: "center",
              color: "#757575",
            }}
          >
            No Campaign engagements found.
          </Typography>
        )}
      </Paper>

      {isEditing && (
        <AddCustomerModal
          open={isEditing}
          onClose={() => setIsEditing(false)}
          onSubmit={handleEditProfile}
          initialData={customer}
        />
      )}

      <AddOrderModal
        open={orderModalOpen}
        onClose={() => {
          setOrderModalOpen(false);
          setEditingOrder(null);
        }}
        customerId={customer._id}
        order={editingOrder}
        onOrderSaved={handleOrderSaved}
      />
    </Box>
  );
};

export default CustomerDetailPage;
