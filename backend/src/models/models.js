import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
    messages: { type: String, required: true },
    time: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
export default Recipe;
