const express = require('express');
const cors = require('cors');
// const multer = require('multer')
const fs = require('fs');
// const memeLib = require("./memeGenerator.js");
// const upload = multer({ dest: './images/' })

const app = express();
const port = 3005;

let recipes = [];
let currentRecipe = '{}';
let stagedRecipeData = '';


app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
// The images directory that is served as a static server
// app.use('/images', express.static('images'));

// Gets all recipes
app.get('/recipes', (req, res) => {
    res.send(recipes);
});

// Posts a new recipe to the book
app.post('/upload/', (req, res) => {
    currentRecipe = req.body;
    const findRecipe = recipes.find(f => f.recipeName.toLowerCase() === currentRecipe.recipeName.toLowerCase());
    if (findRecipe) {
        res.send('This recipe already exists.')
    } else {
        recipes.push(currentRecipe)
        fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes));
        res.send(`Adding recipe to book: ${currentRecipe.recipeName}`)
        console.log(recipes)
    }
});

// Edits a recipe
app.put('/edit', (req, res) => {
    currentRecipe = req.body;
    const findRecipe = recipes.find(f => f.recipeName.toLowerCase() === currentRecipe.recipeName.toLowerCase());
    if (findRecipe) {
        recipes = recipes.filter((recipe) => { return recipe.recipeName.toLowerCase() !== currentRecipe.recipeName.toLowerCase() });
        recipes.push(currentRecipe);
        console.log(recipes)
        fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes));
        console.log(recipes)
        res.send('Editing recipe: ' + currentRecipe.recipeName);
    } else {
        res.send("Recipe does not exist.");
    }
});

// Deletes a recipe
app.delete('/delete', (req, res) => {
    const removeRecipe = req.body;
    if (removeRecipe) {
        recipes = recipes.filter((recipe) => { return recipe.recipeName.toLowerCase() !== removeRecipe.recipeName.toLowerCase() });
        fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes));
        res.send('Removed recipe: ' + removeRecipe.recipeName);
        console.log(recipes);
    }
});

app.listen(port, () => {
    if (!fs.existsSync('./data/')) {
        fs.mkdirSync('./data');
        console.log('Created data directory');
    }
    const recipesFile = './data/recipes.json';
    if (fs.existsSync(recipesFile)) {
        const rawData = fs.readFileSync(recipesFile);
        recipes = JSON.parse(rawData);
    } else {
        // File doesn't exist so create it
        fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes));
    }
    console.log(recipes)
    console.log("length: ", recipes.length)
    console.log(`Loaded ${recipes.length} recipes!`);
    
    const currentFile = './data/currentRecipe.json';
    if (fs.existsSync(currentFile)) {
        const rawData = fs.readFileSync('./data/currentRecipe.json');
        currentRecipe = JSON.parse(rawData);
    } else {
        fs.writeFileSync('./data/currentMeme.json', currentRecipe);
    }
    console.log('Loaded currentRecipe!', currentRecipe);
    console.log('Recipe API listening on port ' + port);
});