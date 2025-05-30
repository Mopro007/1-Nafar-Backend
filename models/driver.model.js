import mongoose from "mongoose";

const DriverSchema = mongoose.Schema({
    name: String,
    phone_number: String,
    password: String,
    profile_picture: String,
    authintication_document_type: String,
    authintication_document_number: String,
    registration_date: Date,
    rating: Number,
    trip_count: Number,
    roads: [String],
    car: String,
    car_model: String,
    car_color: String,
    car_plate_number: String,
    car_capacity: Number,
    car_type: String,
    car_picture: String,
    available_seats: [String],
    seats_prices: {seat: String, price: Number},
    services: [String],
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    is_available: Boolean,
    is_online: Boolean,
    is_in_trip: Boolean,
    current_trip_id: String,
    scheduled_trip_id: String,
    is_verified: Boolean,
    });

const Driver = mongoose.model('Driver', DriverSchema);

export default Driver;