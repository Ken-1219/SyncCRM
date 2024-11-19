import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import "./config/passport.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Body:", req.body);
  console.log("Query Params:", req.query);
  next();
});

connectDB();

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.get(
  "/auth/google",
  (req, res, next) => {
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL + "/",
    failureRedirect: process.env.FRONTEND_URL + "/login",
  })
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Logout error");
    res.redirect("/");
  });
});

app.get("/auth/session", (req, res) => {
  console.log("Session data:", req.session);
  console.log("User in session:", req.user);

  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

const initRoutes = async () => {
  const customerRoutes = (await import("./routes/customerRoutes.js")).default;
  const orderRoutes = (await import("./routes/orderRoutes.js")).default;
  const campaignRoutes = (await import("./routes/campaignRoutes.js")).default;
  const uploadRoutes = (await import("./routes/uploadRoutes.js")).default;

  app.use("/api/customers", customerRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/campaigns", campaignRoutes);
  app.use("/api/uploads", uploadRoutes);
};

await initRoutes();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on: ${PORT}`)
);
