import mongoose from "mongoose";

const PassengerSchema = mongoose.Schema({
    name: String,
    phone_number: String,
    password: String,
    authintication_document_type: String,
    authintication_document_number: String,
    registration_date: Date,
    is_searching: Boolean,
    requested_trip: [String],
    requested_seat: String,
    preferred_seat: String,
    front_seat_preferred_price: [String],
    back_seat_preferred_price: [String],
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    is_online: Boolean,
    current_trip_id: String,
    scheduled_trip_id: String,
    });

const Passenger = mongoose.model('Passenger', PassengerSchema);

export default Passenger;