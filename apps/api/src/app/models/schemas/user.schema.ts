import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    steamid: {type: String, required: true},
    completedGames: {type: [String]}
})
