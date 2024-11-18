// import Order from "../models/Order.js";


// const calculateTotalAmount = (items) => {
//   return items.reduce((total, item) => total + item.quantity * item.price, 0);
// };

// // Create a new order
// const createOrder = async (req, res) => {
//   try {
//     const { items, ...otherData } = req.body;

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Items array is required and cannot be empty" });
//     }

//     const totalAmount = calculateTotalAmount(items);

//     const order = new Order({ ...otherData, items, totalAmount });
//     await order.save();

//     res.status(201).json({ message: "Order created successfully", order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all orders or filtered orders
// const getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find(req.query);
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get a single order by ID
// const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: "Order not found" });
//     res.status(200).json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update an order
// const updateOrder = async (req, res) => {
//   try {
//     const { items, ...otherData } = req.body;

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Items array is required and cannot be empty" });
//     }


//     const totalAmount = calculateTotalAmount(items);

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { ...otherData, items, totalAmount },
//       { new: true }
//     );

//     if (!order) return res.status(404).json({ message: "Order not found" });

//     res.status(200).json({ message: "Order updated successfully", order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete an order
// const deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findByIdAndDelete(req.params.id);
//     if (!order) return res.status(404).json({ message: "Order not found" });
//     res.status(200).json({ message: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export { createOrder, getOrders, getOrderById, updateOrder, deleteOrder };


import Order from "../models/Order.js";
import Customer from "../models/Customer.js";

const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + item.quantity * item.price, 0);
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, customerId, ...otherData } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items array is required and cannot be empty" });
    }

    const totalAmount = calculateTotalAmount(items);

    const order = new Order({ customerId, ...otherData, items, totalAmount });
    await order.save();

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.orders.push(order._id);
    customer.totalSpending += totalAmount;
    await customer.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all orders or filtered orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find(req.query)
      .populate("customerId", "name email") // Optionally include customer details
      .exec();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customerId", "name email") // Optionally include customer details
      .exec();
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  try {
    const { items, customerId, ...otherData } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items array is required and cannot be empty" });
    }

    const totalAmount = calculateTotalAmount(items);

    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder)
      return res.status(404).json({ message: "Order not found" });

    const customer = await Customer.findById(existingOrder.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Adjust totalSpending
    customer.totalSpending =
      customer.totalSpending - existingOrder.totalAmount + totalAmount;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { ...otherData, items, totalAmount },
      { new: true }
    ).exec();

    await customer.save();

    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const customer = await Customer.findById(order.customerId);
    if (customer) {
      customer.totalSpending -= order.totalAmount;
      customer.orders.pull(order._id);
      await customer.save();
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createOrder, getOrders, getOrderById, updateOrder, deleteOrder };
