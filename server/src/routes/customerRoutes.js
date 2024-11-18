import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerControllers.js";

const router = express.Router();

router.get("/", getCustomers);

router.post("/addCustomer", createCustomer);

router.get("/:id", getCustomerById);

router.put("/updateCustomer/:id", updateCustomer);

router.delete("/:id", deleteCustomer);

export default router;
