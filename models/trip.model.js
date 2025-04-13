import mongoose from "mongoose";

const TripSchema = mongoose.Schema({
    driver_id: String,
    passengers_ids: [String],
    starting_date_time: Date,
    ending_date_time: Date,
    starting_location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    starting_location_description: String,
    current_location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    ending_location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    ending_location_description: String,
    rating: Number,
    revenues: [Number],
    is_completed: Boolean,
    is_canceled: Boolean,
    is_in_progress: Boolean,
    is_scheduled: Boolean,
    });

const Trip = mongoose.model('Trip', TripSchema);

export default Trip;