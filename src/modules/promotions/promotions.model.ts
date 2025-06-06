import mongoose from 'mongoose';

const promotionsSchema = new mongoose.Schema({}, { timestamps: true });

const Promotions = mongoose.model('Promotions', promotionsSchema);
export default Promotions;
