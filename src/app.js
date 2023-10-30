const express = require("express");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const HttpError = require("./models/http-error");

dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknow error has ocurred" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sjtjxec.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

/* app.listen(5000, () => {
    console.log("Server running on port 5000");
    console.log(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sjtjxec.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);
  });*/
