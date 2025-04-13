import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import Driver from './models/driver.model.js';

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
//signup API for drivers
app.post('/drivers/signup', async (req, res) => {
  //required request body : 
  //  {
  //  "name": name,
  //  "phone_number": phone_number,
  //  "password": password,
  //  "authintication_document_type": authintication_document_type,
  //  "authintication_document_number": authintication_document_number,
  //  "registration_date": registration_date, "is_online": is_online,
  //  "rating": rating,
  //  "trip_count": trip_count,
  //  "roads": roads,
  //  "car": car,
  //  "car_model": car_model,
  //  "car_color": car_color,
  //  "car_plate_number": car_plate_number,
  //  "car_capacity": car_capacity,
  //  "car_type": car_type,
  //  "car_picture": car_picture,
  //  "available_seats": available_seats,
  //  "seats_prices": {seat: seat, price: price},
  //  "services": services,
  //  "location": { "type": "Point", "coordinates": [longitude, latitude] },
  //  "is_available": is_available,
  //  "is_online": is_online,
  //  "is_in_trip": is_in_trip,
  //  "current_trip_id": current_trip_id, "scheduled_trip_id": scheduled_trip_id,
  //  "scheduled_trip_id": scheduled_trip_id,
  //  "is_verified": is_verified
  //  }
  const { name, phone_number, password, authintication_document_type, authintication_document_number, registration_date, rating, trip_count, roads, car, car_model, car_color, car_plate_number, car_capacity, car_type, car_picture, available_seats, seats_prices, services, location, is_available, is_online, is_in_trip, current_trip_id, scheduled_trip_id } = req.body;
  try {
    // Check if phone number or name already exists in the database
    const existingDriver = await Driver.findOne({ name, phone_number });
    if (existingDriver) {
      return res.status(400).send({ error: 'another driver is already using this name or phone number' });
    }
    // If not, create a new Driver
    const newDriver = new Driver({
      name,
      phone_number,
      password,
      authintication_document_type,
      authintication_document_number,
      registration_date,
      is_online,
      rating,
      trip_count,
      roads,
      car,
      car_model,
      car_color,
      car_plate_number,
      car_capacity,
      car_type,
      car_picture,
      available_seats,
      seats_prices,
      services,
      location: { type: 'Point', coordinates: location.coordinates },
      is_available,
      is_online,
      is_in_trip,
      current_trip_id,
      scheduled_trip_id
    });
    // Save the new Driver to the database
    await newDriver.save();
    res.status(201).send({ message: 'Driver registred successfully', Driver: newDriver });
  } catch (error) {
    console.error('Error creating Driver:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

//login API for drivers
app.post('/drivers/login', async (req, res) => {
  //required request body : {"phone_number": phone_number, "password": password}
  try {
    console.log('Logging in the Driver:', req.body.phone_number , req.body.password);
    // Await the result of findOne
    let Driver = null;
    Driver = await Driver.findOne({ phone_number: req.body.phone_number, password: req.body.password });
    console.log('Driver:', Driver);
    if (!Driver) {
      return res.status(404).send({ error: 'Invalid phone number or password' });
    }
    res.send(Driver);
  } catch (error) {
    console.error('Error logging in Driver:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// get the users specified by the cretiria in the request body
//required request body : {"_id": _id, "name": nanme, "phone_number": phone_number, "trip_count": trip_count, "roads": roads, "car": car, "car_capacity": car_capacity, "car_type": car_type, "available_seats": available_seats, "seats_prices": {seat: seat, price: price}, "services": services, "location": { type: 'Point', coordinates: [longitude, latitude] }, "is_available": is_available, "current_trip_id": current_trip_id, "scheduled_trip_id": scheduled_trip_id}
app.get('/drivers', async (req, res) => {
  try {
    console.log('Getting drivers with criteria:', req.body);
    const criteria = req.body; // Get the criteria from the request body
    // Find the drivers that match the criteria
    const drivers = await Driver.find(criteria);
    if (drivers.length === 0) {
      return res.status(404).send({ error: 'No drivers found' });
    }
    res.send(drivers);
  } catch (error) {
    console.error('Error getting drivers:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Update a specific Driver by ID
app.put('/drivers', async (req, res) => {
  //required request body : {"_id": _id, ...updatedData}
  try {
    const { _id, ...updatedData } = req.body;
    console.log('Updating the Driver with ID:', _id);
    console.log('updatedData:', updatedData);
    // Find the Driver by _id and update with the new data
    const updatedDriver = await Driver.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true } // Return the updated document
    );
    if (!updatedDriver) {
      return res.status(404).send({ error: 'Driver not found' });
    }
    res.send({
      message: 'Driver updated successfully',
      updatedDriver,
    });
  } catch (error) {
    console.error('Error updating Driver:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


// Delete a specific Driver by ID
app.delete('/drivers', async (req, res) => {
  //required request body : {"_id": _id}
  try {
    const { _id } = req.body;
    console.log('Deleting the Driver with ID:', _id);
    // Find the Driver by _id and delete it
    const deletedDriver = await Driver.findByIdAndDelete(_id);
    if (!deletedDriver) {
      return res.status(404).send({ error: 'Driver not found' });
    }
    res.send({
      message: 'Driver deleted successfully',
      deletedDriver,
    });
  } catch (error) {
    console.error('Error deleting Driver:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});
///////////////////////////////////drivers APIs//////////////////////////////////////////////////








//make the server listen on port 5000
app.listen(5000, () => {
  console.log('microservice drivers.js is running on port 5000');
});