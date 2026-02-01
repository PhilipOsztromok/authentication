import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import helmet from "helmet"; // DISABLED 
import config from "./config/config.js";
import databaseService from "./services/database_services.js";
import router from "./router/api_router.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";


const app = express();

app.use((req, res, next) => {
  console.log(` NETWORK HIT: ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

//
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      return callback(null, true);
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1", router);


app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(globalErrorHandler);

// Health Check--------------
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running up!",
  });
});

app.listen(config.server.port, "0.0.0.0", () => {
  console.log(` http://localhost:${config.server.port} `);
});

databaseService
  .connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    // Don't exit process, keep server running to show error
  });
