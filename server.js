const express = require('express');
const cors = require('cors');
// const multer = require('multer');
const fs = require('fs');
// const upload = multer({ dest: './images/' })

const app = express();
const port = 3005;

let recipes = [];


app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/images', express.static('images'));

// Gets all recipes
app.get('/api/recipes', (req, res) => {
    res.send(recipes);
});

app.get('/api/recipes/:id', (req, res) => {
    const recipeName = req.params.id;
    const findRecipe = recipes.find(f => f.recipeName === recipeName);
    if (findRecipe) {
        const recipe = recipes.find(r => r.recipeName === recipeName);
        res.send(recipe)
    } else {
        res.sendStatus(403);
    }
})

// Posts a new recipe to the book
app.post('/api/upload', (req, res) => {
    currentRecipe = req.body;

    const findRecipe = recipes.find(f => f.recipeName === currentRecipe.recipeName);
    if (findRecipe) {
        res.send('A recipe with this name already exists.')
    } else {
        recipes.push(currentRecipe)
        fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes));
        res.send(`Adding recipe to book: ${currentRecipe.recipeName}`)
    }
});

// Edits a recipe
app.put('/api/edit/:id', (req, res) => {
    let editRecipeName = req.params.id;
    let currentRecipe = req.body;

    const findRecipe = recipes.find(f => f.recipeName === editRecipeName);
    const findNewNameRecipe = recipes.find(f => f.recipeName === currentRecipe.recipeName);
    if (findNewNameRecipe) {
        res.send("There is already a recipe with this name.");
    } else {
        if (findRecipe) {
            recipes = recipes.filter((recipe) => { return recipe.recipeName !== editRecipeName });
            recipes.push(currentRecipe);
            fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes));
            res.send('Editing recipe: ' + editRecipeName);
        } else {
            res.send("Recipe does not exist.");
        }
    }
});

// Deletes a recipe
app.delete('/api/delete/:id', (req, res) => {
    let removeRecipeName = req.params.id;
    if (removeRecipeName) {
        recipes = recipes.filter((recipe) => { return recipe.recipeName !== removeRecipeName });
        fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes));
        res.send('Removed recipe: ' + removeRecipeName);
    } else{
        res.send("Error: Cannot delete")
    }
});

app.listen(port, () => {
    // If the data folder does not exist, create it
    if (!fs.existsSync('./data/')) {
        fs.mkdirSync('./data');
        console.log('Created data directory');
    }
    
    // Create recipes.json file
    const recipesFile = './data/recipes.json';
    if (fs.existsSync(recipesFile)) {
        const rawData = fs.readFileSync(recipesFile);
        recipes = JSON.parse(rawData);
    } else {
        // File doesn't exist so create it
        fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes));
    }

    // Logging information so we know it works
    console.log(recipes)
    console.log("length: ", recipes.length)
    console.log(`Loaded ${recipes.length} recipes!`);
    
    console.log('Recipe API listening on port ' + port);
});