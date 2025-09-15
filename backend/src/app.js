import express from "express";
import cors from "cors";
// import { getRecipe, updateRecipe, deleteRecipe, createRecipe } from './controllers/recipeController.js';
import mongoose from "mongoose";
import {createRecipe ,getRecipe,updateRecipe,deleteRecipe} from './controllers/recipeController.js';

const app = express();

app.use(cors()); 
app.use(express.json());

app.post('/recipes', createRecipe);
app.get('/recipes', getRecipe);
app.put('/recipes', updateRecipe);
app.delete('/recipes', deleteRecipe);


export default app;