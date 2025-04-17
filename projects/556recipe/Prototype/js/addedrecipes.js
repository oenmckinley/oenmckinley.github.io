//sessionStorage.setItem("addedRecipes", JSON.stringify([]));

let addedRecipes = JSON.parse(sessionStorage.getItem("addedRecipes")) || [];

let scheduledRecipes = JSON.parse(sessionStorage.getItem("scheduledRecipes")) || {};

let allIngredients = sessionStorage.getItem('allIngredients');
if (allIngredients != null) allIngredients = JSON.parse(allIngredients);
else allIngredients = {};


function addRecipe(title, cid) {
    if (!addedRecipes.includes(title)) {
        addedRecipes.push(title);
    }

    let card = document.getElementById(cid);
    let newHTML = card.innerHTML;

    newHTML = newHTML.replace("add-recipe","rem-recipe");
    newHTML = newHTML.replace("addRecipe(",'remRecipe(');
    newHTML = newHTML.replace(">Add<",'>Remove<');

    card.innerHTML = newHTML;
    sessionStorage.setItem('addedRecipes', addedRecipes);
    //console.log(addedRecipes)
}

function remRecipe(title, cid) {
    const index = addedRecipes.indexOf(title);
    if (index > -1) { // only splice array when item is found
        addedRecipes.splice(index, 1); // 2nd parameter means remove one item only
    }

    let card = document.getElementById(cid);
    let newHTML = card.innerHTML;

    newHTML = newHTML.replace("rem-recipe","add-recipe");
    newHTML = newHTML.replace("remRecipe(",'addRecipe(');
    newHTML = newHTML.replace(">Remove<",'>Add<');

    card.innerHTML = newHTML;

    sessionStorage.setItem('addedRecipes', addedRecipes);
    //console.log(addedRecipes)
}

function getAddedGroceries() {
    //console.log(allIngredients)
    let groceries = [];
    addedRecipes.forEach((recipe) => {
        allIngredients[recipe.title].forEach((ingredient) => {
            if (!groceries.includes(ingredient)) groceries.push(ingredient);
        });
    });
    return groceries;
}

function getScheduledGroceries(recipes) {
    let groceries = [];
    let printed = [];
    recipes.forEach((recipe) => {
        const title = recipe.title || "";
        const ingredients = recipe.ingredients || [];

        let current_week = []
        let current_date = new Date();
        let current_week_end = new Date();
        current_week_end.setDate(current_week_end.getDate()-current_week_end.getDay()+6);
        for (let i = current_date.getDay(); i < 7; i++) {
            let curr = new Date();
            curr.setDate(curr.getDate()-curr.getDay()+i);
            let key = `${curr.getFullYear()}-${curr.getMonth()+1}-${curr.getDate()}`

            if (scheduled(key, title) && !printed.includes(title)) {
                ingredients.forEach((ingredient) => {
                    if (!groceries.includes(ingredient)) groceries.push(ingredient);
                })
                printed.push(title)
            }
        }
    });
    return groceries;

}

function addIngredients(recipes) {
    allIngredients = {};
    recipes.forEach((recipe) => {
        allIngredients[recipe.title] = recipe.ingredients;
    });
    sessionStorage.setItem('allIngredients', JSON.stringify(allIngredients));
}

