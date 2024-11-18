// import Customer from "../models/Customer.js";

// // Create a new customer
// const createCustomer = async (req, res) => {
//   try {
//     const customer = new Customer(req.body);
//     await customer.save();
//     res
//       .status(201)
//       .json({ message: "Customer created successfully", customer });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all customers or filtered customer
// const getCustomers = async (req, res) => {
//   try {
//     const customers = await Customer.find(); // Allow query-based filtering
//     res.status(200).json(customers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get a single customer by ID
// const getCustomerById = async (req, res) => {
//   try {
//     const customer = await Customer.findById(req.params.id);
//     if (!customer)
//       return res.status(404).json({ message: "Customer not found" });
//     res.status(200).json(customer);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update a customer
// const updateCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!customer)
//       return res.status(404).json({ message: "Customer not found" });
//     res
//       .status(200)
//       .json({ message: "Customer updated successfully", customer });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete a customer
// const deleteCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findByIdAndDelete(req.params.id);
//     if (!customer)
//       return res.status(404).json({ message: "Customer not found" });
//     res.status(200).json({ message: "Customer deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export {
//   createCustomer,
//   getCustomers,
//   getCustomerById,
//   updateCustomer,
//   deleteCustomer,
// };


import Customer from "../models/Customer.js";
import Order from "../models/Order.js";

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res
      .status(201)
      .json({ message: "Customer created successfully", customer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate("orders", "orderDate totalAmount status") // Populate summary info of orders
      .exec();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate("orders") // Fetch full order details
      .exec();
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a customer
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("orders") // Ensure populated orders after update
      .exec();
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res
      .status(200)
      .json({ message: "Customer updated successfully", customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    // Optionally delete associated orders
    await Order.deleteMany({ customerId: req.params.id });

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
