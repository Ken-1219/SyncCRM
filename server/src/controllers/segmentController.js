const Customer = require("../models/Customer");

const createSegment = async (req, res) => {
  try {
    const { rules } = req.body;
    const query = {};

    rules.forEach((rule) => {
      const { field, operator, value } = rule;
      if (operator === ">") query[field] = { $gt: value };
      if (operator === "<") query[field] = { $lt: value };
      if (operator === "==") query[field] = value;
    });

    const segment = await Customer.find(query);
    res.status(200).json({ segmentSize: segment.length, segment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createSegment };
