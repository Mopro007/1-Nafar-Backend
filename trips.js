import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import Trip from './models/trip.model.js';

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
  res.send('trips micro-service is running on port 9000');
});









///////////////////////////////////drivers APIs//////////////////////////////////////////////////
//create a trip API
app.post('/trips', async (req, res) => {
  //required request body : 
  //  {
  //  "driver_id": driver_id,
  //  "passengers_ids": passengers_ids,
  //  "starting_date_time": starting_date_time,
  //  "ending_date_time": ending_date_time,
  //  "starting_location": { "type": "Point", "coordinates": [longitude, latitude] },
  //  "starting_location_description": starting_location_description,
  //  "current_location": { "type": "Point", "coordinates": [longitude, latitude] },
  //  "ending_location": { "type": "Point", "coordinates": [longitude, latitude] },
  //  "ending_location_description": ending_location_description,
  //  "rating": rating,
  //  "revenues": revenues,
  //  "is_completed": is_completed,
  //  "is_canceled": is_canceled,
  //  "is_in_progress": is_in_progress,
  //  "is_scheduled": is_scheduled,
  //   }
    const { driver_id, passengers_ids, starting_date_time, ending_date_time, starting_location, starting_location_description, current_location, ending_location, ending_location_description, rating, revenues, is_completed, is_canceled, is_in_progress, is_scheduled } = req.body;
    try {
        //check if the trip already exists
        const existingTrip = await Trip.findOne({ driver_id, starting_date_time, ending_date_time });
        if (existingTrip) {
            return res.status(400).json({ message: 'Driver already has a another trip during the specified time window' });
        }
        //if not, create a new trip
        const newTrip = new Trip({ driver_id, passengers_ids, starting_date_time, ending_date_time, starting_location, starting_location_description, current_location, ending_location, ending_location_description, rating, revenues, is_completed, is_canceled, is_in_progress, is_scheduled });
        await newTrip.save();
        return res.status(201).json(newTrip);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
);

//get trips by specified cretiria or get all trips API
//required request body : {"_id": _id, "driver_id": driver_id, "passengers_ids": passengers_ids, "starting_date_time": starting_date_time, "ending_date_time": ending_date_time, "starting_location": { "type": "Point", "coordinates": [longitude, latitude] }, "starting_location_description": starting_location_description, "current_location": { "type": "Point", "coordinates": [longitude, latitude] }, "ending_location": { "type": "Point", "coordinates": [longitude, latitude] }, "ending_location_description": ending_location_description, "rating": rating, "revenues": revenues, "is_completed": is_completed, "is_canceled": is_canceled, "is_in_progress": is_in_progress, "is_scheduled": is_scheduled}
app.get('/trips', async (req, res) => {
    try{
        const { _id, driver_id, passengers_ids, starting_date_time, ending_date_time, starting_location, starting_location_description, current_location, ending_location, ending_location_description, rating, revenues, is_completed, is_canceled, is_in_progress, is_scheduled } = req.body;
        //if no criteria are specified return all trips
        if (Object.keys(req.body).length === 0) {
            const trips = await Trip.find({});
            return res.status(200).json(trips);
        }
        //if criteria are specified return the trips that match the criteria
        const trips = await Trip.find({ _id, driver_id, passengers_ids, starting_date_time, ending_date_time, starting_location, starting_location_description, current_location, ending_location, ending_location_description, rating, revenues, is_completed, is_canceled, is_in_progress, is_scheduled });
        return res.status(200).json(trips);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
);

//update a trip by ID API
app.put('/trips/', async (req, res) => {
    //required request body : {"_id": _id, ...updatedData}
    const { _id, ...updatedData } = req.body;
    try {
        //check if the trip exists
        const existingTrip = await Trip.findOne({ _id });
        if (!existingTrip) {
            return res.status(400).json({ message: 'Trip not found' });
        }
        //if exists update the trip
        const updatedTrip = await Trip.findByIdAndUpdate(_id, updatedData, { new: true });
        return res.status(200).json(updatedTrip);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
);

//delete a trip by ID API
app.delete('/trips', async (req, res) => {
    //required request body : {"_id": _id}
    const { _id } = req.body;
    try {
        //check if the trip exists
        const existingTrip = await Trip.findOne({ _id });
        if (!existingTrip) {
            return res.status(400).json({ message: 'Trip not found' });
        }
        //if exists delete the trip
        await Trip.findByIdAndDelete(_id);
        return res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
);

///////////////////////////////////drivers APIs//////////////////////////////////////////////////








//make the server listen on port 9000
app.listen(9000, () => {
  console.log('microservice trips.js is running on port 9000');
});