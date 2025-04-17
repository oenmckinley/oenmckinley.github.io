let allRecipes = [];

init();

function init() {
    fetch("../recipes_with_instructions.json")
        .then((res) => res.json())
        .then((recipes) => {
            allRecipes = recipes;
            addIngredients(recipes);
            renderGroceries(recipes);
            renderGroceryList(recipes);
        });
}

function renderGroceryList(recipes) {
    let groceries = getGroceries(recipes);

    const list = document.getElementById("gl");
    list.innerHTML = ``;
    if (groceries.length === 0) list.innerHTML = `<li>No ingredients to add.</li>`
    else {
        groceries.forEach((ingredient) => {
            list.innerHTML += `<li>${ingredient}</li>`
        })
    }
}

function getGroceries(recipes) {
    let added = getAddedGroceries();
    let scheduled = getScheduledGroceries(recipes);
    let groceries = []

    added.forEach((ingredient) => {
        if (!groceries.includes(ingredient)) groceries.push(ingredient);
    })
    scheduled.forEach((ingredient) => {
        if (!groceries.includes(ingredient)) groceries.push(ingredient);
    })

    return groceries;
}

function scheduled(key, title) {
    //console.log(key in scheduledRecipes)
    if (!(key in scheduledRecipes)) return false;
    if ('breakfast' in scheduledRecipes[key] && scheduledRecipes[key]['breakfast'].includes(title)) return true;
    if ('lunch' in scheduledRecipes[key] && scheduledRecipes[key]['lunch'].includes(title)) return true;
    if ('dinner' in scheduledRecipes[key] && scheduledRecipes[key]['dinner'].includes(title)) return true;
    return false;
}

function added(title) {
    //console.log(addedRecipes)
    //console.log(title)
    for (let i = 0; i < addedRecipes.length; i++) {
        if (addedRecipes[i].title === title) {
            return true;
        }
    }
    return false;
}

function addRecipe(title, cardId) {
    const recipe = allRecipes.find(r => r.title === title);
    if (!addedRecipes.some(r => r.title === title)) addedRecipes.push(recipe);
    sessionStorage.setItem("addedRecipes", JSON.stringify(addedRecipes));
    document.getElementById(cardId).querySelector("button").outerHTML = `<button class="rem-recipe" onclick="remRecipe('${title}', '${cardId}')">Remove</button>`;
    init();
}

function remRecipe(title, cardId) {
    addedRecipes = addedRecipes.filter(r => r.title !== title);
    sessionStorage.setItem("addedRecipes", JSON.stringify(addedRecipes));
    document.getElementById(cardId).querySelector("button").outerHTML = `<button class="add-recipe" onclick="addRecipe('${title}', '${cardId}')">Add</button>`;
    init();
}


function renderGroceries(recipes) {
    const grid1 = document.getElementById("addedGrid");
    const grid2 = document.getElementById("weekGrid");
    grid1.innerHTML = "";
    grid2.innerHTML = "";

    if (addedRecipes.length > 0) {
        let i = 0;
        addedRecipes.forEach((recipe) => {
            const title = recipe.title || "";
            const ingredients = recipe.ingredients || [];
            const preferences = recipe.preference || [];
            const restrictions = recipe.restriction || [];
            const utensils = recipe.utensils || [];
            const instruction = recipe.instruction || "";

            const card = document.createElement("div");
            card.className = "recipe-card groceries-card";
            card.id = "addcard" + i.toString();

            card.innerHTML = `
          ${recipe.img ? `<img src="${recipe.img}" alt="${recipe.title}" class="recipe-img" />` : ``}
          <h4>${recipe.title}</h4>
          <p><strong>${recipe.cost}</strong> • ${recipe.time} mins</p>
          ${added(title) ? `<button class="rem-recipe" onclick="remRecipe('${title}', '${card.id}')">Remove</button>` : `<button class="add-recipe" onclick="addRecipe('${title}', '${card.id}')">Add</button>`}
            `;

            //console.log(added(title))
            grid1.appendChild(card);

            i++;

        });
    } else {
        const card = document.createElement("div");
        card.className = "recipe-card groceries-card";

        card.innerHTML = `<h4>No Added Recipes!</h4>`;

        grid1.appendChild(card);
    }

    //console.log(scheduledRecipes)
    if (Object.keys(scheduledRecipes).length > 0) {
        let n = 0;
        let printed = [];
        recipes.forEach((recipe) => {
            const title = recipe.title || "";
            const ingredients = recipe.ingredients || [];
            const preferences = recipe.preference || [];
            const restrictions = recipe.restriction || [];
            const utensils = recipe.utensils || [];
            const instruction = recipe.instruction || "";

            let current_week = []
            let current_date = new Date();
            let current_week_end = new Date();
            current_week_end.setDate(current_week_end.getDate()-current_week_end.getDay()+6);
            for (let i = current_date.getDay(); i < 7; i++) {
                let curr = new Date();
                curr.setDate(curr.getDate()-curr.getDay()+i);
                let key = `${curr.getFullYear()}-${curr.getMonth()+1}-${curr.getDate()}`
                //console.log(scheduledRecipes)
                //console.log(key)
                //console.log(title)

                if (scheduled(key, title) && !printed.includes(title)) {

                    const card = document.createElement("div");
                    card.className = "recipe-card groceries-card";
                    card.id = "weekcard" + n.toString();

                    card.innerHTML = `
                  ${recipe.img ? `<img src="${recipe.img}" alt="${recipe.title}" class="recipe-img" />` : ``}
                  <h4>${recipe.title}</h4>
                  <p><strong>${recipe.cost}</strong> • ${recipe.time} mins</p>
                  ${added(title) ? `<button class="rem-recipe" onclick="remRecipe('${title}', '${card.id}')">Remove</button>` : `<button class="add-recipe" onclick="addRecipe('${title}', '${card.id}')">Add</button>`}
                    `;

                    grid2.appendChild(card);

                    printed.push(title);
                    n++;
                }
            }
        });
    } else {
        const card = document.createElement("div");
        card.className = "recipe-card groceries-card";

        card.innerHTML = `<h4>No Added Recipes!</h4>`;

        grid2.appendChild(card);
    }
}

function downloadGroceries(ext) {
    let list = document.getElementById("gl").innerHTML;
    list = list.replaceAll('</li><li>', '\n');
    list = list.replaceAll('<li>', '').replace('</li>', '')
    if (ext === 'csv') list = 'Ingredients\n'

    let filename = 'groceries.'+ext
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(list));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}
