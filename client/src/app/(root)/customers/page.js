/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Grid2, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import axios from "axios";
import { toast } from "react-hot-toast";
import { capitalize } from "@/app/utils/capitalize";
import CustomerCard from "@/app/components/customers/CustomerCard";
import AddCustomerModal from "@/app/components/customers/AddCustomerCard";
import FilterChip from "@/app/components/FilterChip";
import FilterModal from "@/app/components/FilterModal";
import Loader from "@/app/components/Loader";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [spendingFilter, setSpendingFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [pendingFilters, setPendingFilters] = useState({
    searchQuery: "",
    spendingFilter: "",
    visitFilter: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/customers/`);
      if (response.data && Array.isArray(response.data)) {
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [API_URL]);

  const handleAddCustomer = async (newCustomer) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/customers/addCustomer`,
        newCustomer,
        { headers: { "Content-Type": "application/json" } }
      );
      const addedCustomer = response.data?.customer || response.data;
      if (addedCustomer) {
        setCustomers((prev) => [...prev, addedCustomer]);
        setFilteredCustomers((prev) => [...prev, addedCustomer]);
        toast.success(
          `Customer "${capitalize(addedCustomer.name)}" added successfully!`
        );
      } else {
        toast.error("Unexpected response format from server.");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Failed to add customer. Please try again.");
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`${API_URL}/api/customers/${customerId}`);
      setCustomers((prev) => prev.filter((c) => c._id !== customerId));
      setFilteredCustomers((prev) => prev.filter((c) => c._id !== customerId));
      toast.success("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer. Please try again.");
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setOpenModal(true);
  };

  const handleSaveCustomer = async (updatedCustomer) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/customers/updateCustomer/${updatedCustomer._id}`,
        updatedCustomer,
        { headers: { "Content-Type": "application/json" } }
      );
      const updatedData = response.data.customer;
      if (updatedData && updatedData._id) {
        setCustomers((prev) =>
          prev.map((c) => (c._id === updatedCustomer._id ? updatedData : c))
        );
        setFilteredCustomers((prev) =>
          prev.map((c) => (c._id === updatedCustomer._id ? updatedData : c))
        );
        toast.success(
          `Customer "${capitalize(updatedData.name)}" updated successfully!`
        );
        setOpenModal(false);
        setEditingCustomer(null);
      } else {
        toast.error("Unexpected response format. Refreshing data...");
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer. Please try again.");
    }
  };

  const applyFilters = (filters = pendingFilters) => {
    const { searchQuery, spendingFilter, visitFilter } = filters;

    let filtered = [...customers];

    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (spendingFilter) {
      const spendingLimit = parseInt(spendingFilter, 10);
      filtered = filtered.filter(
        (customer) => customer.totalSpending >= spendingLimit
      );
    }

    if (visitFilter) {
      const visitLimit = parseInt(visitFilter, 10);
      filtered = filtered.filter((customer) => customer.visits >= visitLimit);
    }

    setFilteredCustomers(filtered);
    return filtered;
  };

  const removeFilter = (filterKey) => {
    setPendingFilters((prev) => ({
      ...prev,
      [filterKey]: "",
    }));

    setFilteredCustomers(() => {
      const updatedFilters = {
        ...pendingFilters,
        [filterKey]: "",
      };

      return applyFilters(updatedFilters);
    });
  };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
        minHeight: "100vh",
        padding: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        mb={2}
        sx={{
          fontWeight: "bold",
          color: "#4A4A4A",
          textAlign: "center",
        }}
      >
        Customers
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4A90E2",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#357ABD" },
          }}
          onClick={() => {
            setEditingCustomer(null);
            setOpenModal(true);
          }}
        >
          Add Customer
        </Button>
        <IconButton
          sx={{
            backgroundColor: "#E3EEFF",
            color: "#4A90E2",
            "&:hover": { backgroundColor: "#D6E5FF" },
          }}
          onClick={() => setFilterModalOpen(true)}
        >
          <FilterListIcon />
        </IconButton>
      </Box>

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Loader size={40} fullScreen />
        </Box>
      )}

      {!loading && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
            justifyContent: "center",
          }}
        >
          {pendingFilters.searchQuery && (
            <FilterChip
              label={`Search: ${pendingFilters.searchQuery}`}
              onDelete={() => removeFilter("searchQuery")}
            />
          )}
          {pendingFilters.spendingFilter && (
            <FilterChip
              label={`Spending: Over ₹${pendingFilters.spendingFilter}`}
              onDelete={() => removeFilter("spendingFilter")}
            />
          )}
          {pendingFilters.visitFilter && (
            <FilterChip
              label={`Visits: Over ${pendingFilters.visitFilter}`}
              onDelete={() => removeFilter("visitFilter")}
            />
          )}
        </Box>
      )}

      {!loading && (
        <Grid2
          container
          spacing={3}
          sx={{ justifyContent: "center", padding: { xs: 2, sm: 4 } }}
        >
          {filteredCustomers.map((customer, index) => (
            <Grid2 xs={12} sm={6} md={4} key={customer._id || index}>
              <CustomerCard
                customer={customer}
                onDelete={() => handleDeleteCustomer(customer._id)}
                onEdit={() => handleEditCustomer(customer)}
              />
            </Grid2>
          ))}
        </Grid2>
      )}

      {openModal && (
        <AddCustomerModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={editingCustomer ? handleSaveCustomer : handleAddCustomer}
          initialData={editingCustomer}
        />
      )}

      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        pendingFilters={pendingFilters}
        setPendingFilters={setPendingFilters}
        applyFilters={applyFilters}
      />
    </Box>
  );
};

export default CustomersPage;
