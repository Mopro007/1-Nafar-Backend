import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import Passenger from './models/passenger.model.js';

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
  res.send('passengers micro-service is running on port 8000');
});









///////////////////////////////////passengers APIs//////////////////////////////////////////////////
//signup API for passengers
app.post('/passengers/signup', async (req, res) => {
  //required request body : 
  //  {
  //  "name": name,
  //  "phone_number": phone_number,
  //  "password": password,
  //  "authintication_document_type": authintication_document_type,
  //  "authintication_document_number": authintication_document_number,
  //  "registration_date": registration_date, "is_online": is_online,
  //  "is_searching": is_searching,
  //  "requested_trip": requested_trip,
  //  "requested_seat": requested_seat,
  //  "preferred_seat": preferred_seat,
  //  "front_seat_preferred_price": front_seat_preferred_price,
  //  "back_seat_preferred_price": back_seat_preferred_price,
  //  "location": { "type": "Point", "coordinates": [longitude, latitude] },
  //  "is_online": is_online,
  //  "current_trip_id": current_trip_id,
  //  "scheduled_trip_id": scheduled_trip_id,
  //   }
  const { name, phone_number, password, authintication_document_type, authintication_document_number, registration_date, is_online, is_searching, requested_trip, requested_seat, preferred_seat, front_seat_preferred_price, back_seat_preferred_price, location, current_trip_id, scheduled_trip_id } = req.body;
  try {
    //check if the passenger already exists
    const existingDriver = await Passenger.findOne({ name, phone_number });
    if (existingDriver) {
      return res.status(400).json({ message: 'Passenger already exists' });
    }
    //if not, create a new passenger
    const passenger = new Passenger({
      name,
      phone_number,
      password,
      authintication_document_type,
      authintication_document_number,
      registration_date,
      is_online,
      is_searching,
      requested_trip,
      requested_seat,
      preferred_seat,
      front_seat_preferred_price,
      back_seat_preferred_price,
      location: { type: 'Point', coordinates: location },
      current_trip_id,
      scheduled_trip_id
    });
    await passenger.save();
    res.status(201).json({ message: 'Passenger created successfully', passenger });
  }
  catch (error) {
    console.error('Error creating passenger:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//login API for passengers
app.post('/passengers/login', async (req, res) => {
  //required request body : {"phone_number": phone_number, "password": password}
  const { phone_number, password } = req.body;
  try {
    //check if the passenger exists
    const passenger = await Passenger.findOne({ phone_number, password });
    if (!passenger) {
      return res.status(400).json({ message: 'Invalid phone number or password' });
    }
    res.status(200).json({ message: 'Passenger logged in successfully', passenger });
  }
  catch (error) {
    console.error('Error logging in passenger:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//get any passenger by any specified creteria or get all passengers API
//required request body : {"_id": _id, "name": name, "phone_number": phone_number, "is_searching": is_searching, "requested_trip": requested_trip, "requested_seat": requested_seat, "preferred_seat": preferred_seat, "front_seat_preferred_price": front_seat_preferred_price, "back_seat_preferred_price": back_seat_preferred_price, "location": { "type": "Point", "coordinates": [longitude, latitude] }, "current_trip_id": current_trip_id, "scheduled_trip_id": scheduled_trip_id}
app.get('/passengers/get', async (req, res) => {
  const { _id, name, phone_number, is_searching, requested_trip, requested_seat, preferred_seat, front_seat_preferred_price, back_seat_preferred_price, location, current_trip_id, scheduled_trip_id } = req.body;
  try {
    //get the passenger by any specified creteria or get all passengers
    const passengers = await Passenger.find({ _id: _id || {}, name: name || {}, phone_number: phone_number || {}, is_searching: is_searching || {}, requested_trip: requested_trip || {}, requested_seat: requested_seat || {}, preferred_seat: preferred_seat || {}, front_seat_preferred_price: front_seat_preferred_price || {}, back_seat_preferred_price: back_seat_preferred_price || {}, location: location || {}, current_trip_id: current_trip_id || {}, scheduled_trip_id: scheduled_trip_id || {} });
    if (!passengers || passengers.length === 0) {
      return res.status(404).json({ message: 'No passengers found' });
    }
    else {
      res.status(200).json({ message: 'Passengers retrieved successfully', passengers });
    }
  }
  catch (error) {
    console.error('Error getting passengers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
);

//update passenger by ID API
app.put('/passengers', async (req, res) => {
  //required request body : {"_id": _id, ...updatedData}
  const { _id, ...updatedData } = req.body;
  try {
    //update the passenger by ID
    const passenger = await Passenger.findByIdAndUpdate(_id, updatedData, { new: true });
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.status(200).json({ message: 'Passenger updated successfully', passenger });
  }
  catch (error) {
    console.error('Error updating passenger:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
);

//delete passenger by ID API
app.delete('/passengers', async (req, res) => {
  //required request body : {"_id": _id}
  const { _id } = req.body;
  try {
    //delete the passenger by ID
    const passenger = await Passenger.findByIdAndDelete(_id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.status(200).json({ message: 'Passenger deleted successfully', passenger });
  }
  catch (error) {
    console.error('Error deleting passenger:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
);
///////////////////////////////////passengers APIs//////////////////////////////////////////////////








//make the server listen on port 8000
app.listen(8000, () => {
  console.log('microservice passengers.js is running on port 8000');
});