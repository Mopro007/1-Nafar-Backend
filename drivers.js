import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';

config();

//establishing the connection to the database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connection to database established successfully!'))
  .catch(err => console.log(err));

//creating the server and using express to handle the requests, and to parse the requests body using json middleware
const app = express();
app.use(cors());
app.options('*', cors()); // Handle preflight requests for all routes
app.use(express.json());

//test api
app.get('/test', (req, res) => {
  res.send('drivers micro-service is running on port 5000');
});









///////////////////////////////////drivers APIs//////////////////////////////////////////////////

///////////////////////////////////drivers APIs//////////////////////////////////////////////////








//make the server listen on port 5000
app.listen(5000, () => {
  console.log('microservice drivers.js is running on port 5000');
});