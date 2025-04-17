let allRecipes = [];
let planner = JSON.parse(sessionStorage.getItem("addedRecipes")) || [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("../recipes_with_instructions.json")
        .then((res) => res.json())
        .then((recipes) => {
            allRecipes = recipes;
            renderRecipes(allRecipes);
            populateSearchFilters(allRecipes);
        });
});
// Event listeners for filter buttons
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".btn_filters");
    if (filterButtons.length >= 2) {
        filterButtons[0].addEventListener("click", applyFilters);
        filterButtons[1].addEventListener("click", () => renderRecipes(allRecipes));
    } else {
        console.warn("Filter buttons not found");
    }
});

function applyFilters() {
    const costInputs = document.querySelectorAll("input[type='number']");
    const costMin = parseFloat(costInputs[0].value) || 0;
    const costMax = parseFloat(costInputs[1].value) || 1000;

    const timeMin = parseFloat(costInputs[2].value) || 0;
    const timeMax = parseFloat(costInputs[3].value) || 1000;

    const selectedIngredients = getCheckedValues("#search-filter input[type='checkbox']");
    const excludedIngredients = getCheckedValues(".filter-section:nth-of-type(4) input[type='checkbox']");
    const selectedPreferences = getCheckedValues(".filter-section:nth-of-type(5) input[type='checkbox']");
    const selectedUtensils = getCheckedValues(".filter-section:nth-of-type(6) input[type='checkbox']");

    const filtered = allRecipes.filter((recipe) => {
        const costVal = parseFloat(recipe.cost.replace('$', ''));
        const timeVal = parseFloat(recipe.time);

        const hasAllIngredients = selectedIngredients.every(ing => recipe.ingredients.map(i => normalize(i)).includes(ing));
        const hasNoExcluded = excludedIngredients.every(ex => !recipe.ingredients.map(i => normalize(i)).includes(ex));
        const hasPreference = selectedPreferences.length === 0 || selectedPreferences.some(pref => recipe.preference.map(p => normalize(p)).includes(pref));
        const hasUtensils = selectedUtensils.length === 0 || selectedUtensils.every(ut => recipe.utensils.map(u => normalize(u)).includes(ut));

        return costVal >= costMin && costVal <= costMax &&
            timeVal >= timeMin && timeVal <= timeMax &&
            hasAllIngredients && hasNoExcluded && hasPreference && hasUtensils;
    });

    renderRecipes(filtered);
}

function getCheckedValues(selector) {
    return Array.from(document.querySelectorAll(selector + ":checked"))
        .map(cb => cb.value.toLowerCase());
}

function renderRecipes(recipes) {
    const grid = document.getElementById("recipeGrid");
    grid.innerHTML = "";

    recipes.forEach((recipe) => {
        const ingredients = recipe.ingredients || [];
        const preferences = recipe.preference || [];
        const restrictions = recipe.restriction || [];
        const utensils = recipe.utensils || [];
        const instruction = recipe.instruction || "";
        const isAdded = planner.some(r => r.title === recipe.title);

        const card = document.createElement("div");
        card.className = "recipe-card";
        card.id = recipe.title.replace(/\s+/g, '-').toLowerCase();

        card.innerHTML = `
        <h4>${recipe.title}</h4>
        <img src="../img/video.png" alt="${recipe.title}" class="recipe-img" />
        <p>${recipe.cost}${recipe.time} mins</p>
        <strong>Ingredients:</strong>
        <ul>
            ${ingredients.slice(0, 4).map(i => `<li>${i}</li>`).join("")}
        </ul>
        <div style="display: flex; ">
        <a href="recipe.html?title=${encodeURIComponent(recipe.title)}" class="show-more-link">Show More</a>
        <button class="${isAdded ? 'rem-recipe' : 'add-recipe'}" onclick="${isAdded ? 'remRecipe' : 'addRecipe'}('${recipe.title}', '${card.id}')">${isAdded ? 'Remove' : 'Add'}</button>
        </div>
        `;

        grid.appendChild(card);
    });
}

function addRecipe(title, cardId) {
    const recipe = allRecipes.find(r => r.title === title);
    if (!planner.some(r => r.title === title)) planner.push(recipe);
    sessionStorage.setItem("addedRecipes", JSON.stringify(planner));
    document.getElementById(cardId).querySelector("button").outerHTML = `<button class="rem-recipe" onclick="remRecipe('${title}', '${cardId}')">Remove</button>`;
}

function remRecipe(title, cardId) {
    planner = planner.filter(r => r.title !== title);
    sessionStorage.setItem("addedRecipes", JSON.stringify(planner));
    document.getElementById(cardId).querySelector("button").outerHTML = `<button class="add-recipe" onclick="addRecipe('${title}', '${cardId}')">Add</button>`;
}

function populateSearchFilters(recipes) {
    const ingredientSet = new Set();
    const preferenceSet = new Set();
    const utensilSet = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(i => ingredientSet.add(normalize(i)));
        recipe.preference.forEach(p => preferenceSet.add(normalize(p)));
        recipe.utensils.forEach(u => utensilSet.add(normalize(u)));
    });

    populateFilterSection("#search-filter", Array.from(ingredientSet));
    populateFilterSection(".filter-section:nth-of-type(4)", Array.from(ingredientSet));
    populateFilterSection(".filter-section:nth-of-type(5)", Array.from(preferenceSet));
    populateFilterSection(".filter-section:nth-of-type(6)", Array.from(utensilSet));
}

function populateFilterSection(selector, items) {
    const section = document.querySelector(selector);
    const searchInput = section.querySelector("input[type='text']");

    const wrapper = document.createElement("div");
    wrapper.classList.add("filter-options");

    const uniqueItems = [...new Set(items.map(item => normalize(item)))];

    let expanded = false;

    uniqueItems.sort().forEach((item, index) => {
        const label = document.createElement("label");
        const displayText = item.charAt(0).toUpperCase() + item.slice(1);
        label.innerHTML = `<input type='checkbox' value='${item}'> ${displayText}`;
        if (index >= 2) label.style.display = "none";
        wrapper.appendChild(label);
    });

    const lessBtn = document.createElement("button");
    lessBtn.textContent = "Less";
    lessBtn.className = "show-less";
    lessBtn.style.display = "none";

    const moreBtn = document.createElement("button");
    moreBtn.textContent = "More";
    moreBtn.className = "show-more";
    moreBtn.style.display = uniqueItems.length > 2 ? "block" : "none";

    moreBtn.addEventListener("click", () => {
        wrapper.querySelectorAll("label").forEach(label => label.style.display = "block");
        moreBtn.style.display = "none";
        lessBtn.style.display = "block";
        expanded = true;
    });

    lessBtn.addEventListener("click", () => {
        wrapper.querySelectorAll("label").forEach((label, index) => {
            label.style.display = index < 2 ? "block" : "none";
        });
        lessBtn.style.display = "none";
        moreBtn.style.display = uniqueItems.length > 2 ? "block" : "none";
        expanded = false;
    });

    section.appendChild(lessBtn);
    section.appendChild(wrapper);
    section.appendChild(moreBtn);

    // Live filter
    searchInput.addEventListener("input", function () {
        const term = this.value.toLowerCase();
        let matches = 0;
        Array.from(wrapper.children).forEach((label, index) => {
            const text = label.textContent.toLowerCase();
            const match = text.includes(term);
            label.style.display = match ? "block" : "none";
            if (match) matches++;
        });
        if (!expanded) {
            moreBtn.style.display = matches > 2 ? "block" : "none";
            lessBtn.style.display = "none";
        }
        if (term === "") {
            wrapper.querySelectorAll("label").forEach((label, index) => {
                label.style.display = index < 2 ? "block" : "none";
            });
            moreBtn.style.display = uniqueItems.length > 2 ? "block" : "none";
            lessBtn.style.display = "none";
            expanded = false;
        }
    });
}

function normalize(str) {
    return str.toLowerCase().trim().replace(/s$/, '');
}
