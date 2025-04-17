const index2month = {
    0:'Jan',
    1:'Feb',
    2:'Mar',
    3:'Apr',
    4:'May',
    5:'Jun',
    6:'Jul',
    7:'Aug',
    8:'Sep',
    9:'Oct',
    10:'Nov',
    11:'Dec'
}

const index2day = {
    1:'Mon',
    2:'Tue',
    3:'Wed',
    4:'Thu',
    5:'Fri',
    6:'Sat',
    0:'Sun'
}

let added_recipes_data;
let scheduled_meals_data;
let current_date_start = new Date();
current_date_start.setDate(current_date_start.getDate()-current_date_start.getDay());

function update_schedule(dayone){

    const date_range = document.getElementsByClassName('schedule_date_selection')[0];
    date_range.innerHTML = `${index2month[dayone.getMonth()]} ${dayone.getDate()} - `;

    for(let index=0; index<7; index++){
        const newday = new Date(dayone.getTime());
        newday.setDate(dayone.getDate()+index);
        if(index==6){
            date_range.innerHTML += `${index2month[newday.getMonth()]} ${newday.getDate()}`;
        }

        let key = `${newday.getFullYear()}-${newday.getMonth()+1}-${newday.getDate()}`;
        let meals = scheduled_meals_data[key];
        const currentDiv = document.getElementById(`day${index+1}`);
        currentDiv.getElementsByClassName('calendar_date')[0].innerHTML = `${index2day[newday.getDay()]} ${index2month[newday.getMonth()]} ${newday.getDate()}`;
        currentDiv.getElementsByClassName('full_calendar_date')[0].innerHTML = key;
        if(meals){

            const meals_key = ['breakfast','lunch','dinner'];
            const meals_default = ['Add Breakfast','Add Lunch','Add Dinner'];
            const meal2color = ['#FFD9D9','#FEE6C9','#D2F0FF'];
            const meals_div = currentDiv.getElementsByClassName('calendar_meals');
            for(let i=0;i<3;i++){
                let meal = meals[meals_key[i]];
                if(meal){
                    meals_div[i].getElementsByClassName('meal_name')[0].innerHTML = meal.join(', ');
                    meals_div[i].style.background = meal2color[i];
                    meals_div[i].addEventListener('mouseenter',()=>{
                        meals_div[i].style.background = meal2color[i];
                        meals_div[i].style.cursor = 'pointer';
                    });
                }
                else{
                    meals_div[i].getElementsByClassName('meal_name')[0].innerHTML = meals_default[i];
                    meals_div[i].style.background = 'none';
                    meals_div[i].addEventListener('mouseenter',()=>{
                        meals_div[i].style.background = meal2color[i];
                        meals_div[i].style.cursor = 'pointer';
                    });
                    meals_div[i].addEventListener('mouseleave',()=>{
                        meals_div[i].style.background = 'none';
                    });
                }
            }
        }
        else{
            const meal2color = ['#FFD9D9','#FEE6C9','#D2F0FF'];
            const meals_default = ['Add Breakfast','Add Lunch','Add Dinner'];
            const meals_div = currentDiv.getElementsByClassName('calendar_meals');
            for(let i=0;i<3;i++){
                meals_div[i].getElementsByClassName('meal_name')[0].innerHTML = meals_default[i];
                meals_div[i].style.background = 'none';
                meals_div[i].addEventListener('mouseenter',()=>{
                    meals_div[i].style.background = meal2color[i];
                    meals_div[i].style.cursor = 'pointer';
                });
                meals_div[i].addEventListener('mouseleave',()=>{
                    meals_div[i].style.background = 'none';
                });
            }
        }

    };

    let calendar_meals = document.getElementsByClassName('calendar_meals');
    let calendar_meals_list = Array.from(calendar_meals);
    calendar_meals_list.forEach(element => {
        element.addEventListener('click', (event) => {
            const hover_div = document.getElementsByClassName('meal_hover_div')[0];
            hover_div.style.display = 'block';
            hover_div.style.top = event.y+'px';
            hover_div.style.left = event.x+'px';
            hover_div.getElementsByClassName('scheduled_meals')[0].innerHTML = '';
            if(event.x+hover_div.offsetWidth>=window.innerWidth){
                hover_div.style.left = (window.innerWidth-hover_div.offsetWidth)+'px';
            }
            if(event.y+hover_div.offsetHeight>=window.innerHeight-50){
                hover_div.style.top = (window.innerHeight-hover_div.offsetHeight-50)+'px';
            }
            const calendar_date = element.parentNode.getElementsByClassName('full_calendar_date')[0].innerHTML;
            const meals_name = element.getElementsByClassName('meal_name')[0].innerHTML;

            // Add meals to scheduled_meals
            if((!meals_name.startsWith('Add Breakfast'))&&(!meals_name.startsWith('Add Lunch'))&&(!meals_name.startsWith('Add Dinner'))){
                let all_meals = meals_name.split(', ');
                console.log(all_meals);
                const scheduled_meals = hover_div.getElementsByClassName('scheduled_meals')[0];
                hover_div.getElementsByClassName('meal_date')[0].innerHTML = calendar_date

                for(let i=0;i<all_meals.length;i++){
                    const new_meal = document.createElement('div');
                    new_meal.classList.add('scheduled_meal');
                    new_meal.style.top = `${i*20+2}%`;
                    const newp = document.createElement('p');
                    newp.classList.add('scheduled_meal_name');
                    newp.classList.add('scheduled_meal_name');
                    newp.innerHTML = all_meals[i];
                    new_meal.appendChild(newp);
                    scheduled_meals.appendChild(new_meal);
                    new_meal.addEventListener('click',(event)=>{
                        const param = all_meals[i];
                        const url = `recipe.html?param1=${param}`;
                        window.location.href = url;
                    });
                    new_meal.addEventListener('mouseenter',(event)=>{
                        new_meal.style.cursor = 'pointer';
                    });
                }
            }
        })
    });
    const hover_div = document.getElementsByClassName('meal_hover_div')[0];
    document.addEventListener('click', function(event) {
        if (!hover_div.contains(event.target) && event.target.className!=='calendar_meals' && event.target.className!=='meal_name') {
            hover_div.style.display = 'none';
        };
    });
    hover_div.getElementsByClassName('meal_hover_clear')[0].addEventListener('click',function(){
        let clear_date = hover_div.getElementsByClassName('meal_date')[0].innerHTML;
        delete scheduled_meals_data[clear_date]
        sessionStorage.setItem("scheduledRecipes", JSON.stringify(scheduled_meals_data));
        hover_div.style.display = 'none';
        update_schedule(new Date(current_date_start.getTime()));
    });
    hover_div.getElementsByClassName('meal_hover_search')[0].addEventListener('click',function(){
        const url = `1.recipes.html`;
        window.location.href = url;
    });
}

// function saveJsonToFile(data, filename = "data.json") {
//     const jsonStr = JSON.stringify(data, null, 2);  // 美化输出
//     console.log(jsonStr);
//     const blob = new Blob([jsonStr], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     console.log(url);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();

//     URL.revokeObjectURL(url);
// }

window.onload = function() {

    // load added recipes

    let added_recipes = [];
    addedRecipes.forEach((recipe) =>{
        added_recipes.push(recipe.title);
        });

    added_recipes_data = added_recipes;

    const added_recipes_div = document.getElementsByClassName('added_recipes_list')[0];

    // list all the added recipes
    for (let index = 0; index < added_recipes.length; index++) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('recipes');
        newDiv.style.top = `${Math.floor(index/6)*20+3}%`;
        newDiv.style.left = `${(index%6)*16+3}%`;
        const newp = document.createElement('p');
        newp.classList.add('recipe_name');
        newp.innerHTML = added_recipes[index];
        newDiv.appendChild(newp);
        added_recipes_div.appendChild(newDiv);
    }

    // add click event, to show a floating div
    let recipes = document.getElementsByClassName('recipes');
    let recipesList = Array.from(recipes);
    recipesList.forEach(element => {
        element.addEventListener('click', (event) => {
            const hover_div = document.getElementsByClassName('recipe_hover_div')[0];
            hover_div.style.display = 'block';
            hover_div.style.top = event.y+'px';
            hover_div.style.left = event.x+'px';
            hover_div.getElementsByClassName('recipe_name')[0].innerHTML = element.getElementsByClassName('recipe_name')[0].innerHTML;
            if(event.x+hover_div.offsetWidth>window.innerWidth){
                hover_div.style.left = (window.innerWidth-hover_div.offsetWidth)+'px';
            }
            if(event.y+hover_div.offsetHeight>window.innerHeight){
                hover_div.style.top = (window.innerHeight-hover_div.offsetHeight)+'px';
            }

            let default_date = `${current_date_start.getFullYear()}-${current_date_start.getMonth() < 9 ? "0" + (current_date_start.getMonth()+1).toString() : (current_date_start.getMonth()+1).toString()}-${current_date_start.getDate()}`;
            document.getElementById('date_from').value = default_date;
            document.getElementById('date_to').value = default_date;
            document.getElementById('to_breakfast').checked = false;
            document.getElementById('to_lunch').checked = false;
            document.getElementById('to_dinner').checked = false;
        });
    });
    const hover_div = document.getElementsByClassName('recipe_hover_div')[0];
    document.addEventListener('click', function(event) {
        if (!hover_div.contains(event.target) && event.target.className!=='recipes' && event.target.className!=='recipe_name') {
            hover_div.style.display = 'none';
        };
    });
    // show the details of an added recipe
    hover_div.getElementsByClassName('recipe_hover_show')[0].addEventListener('click',function(){
        const param = hover_div.getElementsByClassName('recipe_name')[0].innerHTML;
        const url = `recipe.html?param1=${param}`;
        window.location.href = url;
    });

    hover_div.getElementsByClassName('recipe_hover_add')[0].addEventListener('click',function(){
        const date_from_value = document.getElementById('date_from').value.replaceAll('-0','-');
        const date_to_value = document.getElementById('date_to').value.replaceAll('-0','-');

        const date_from = new Date(date_from_value);
        const date_to = new Date(date_to_value);

        if(date_from_value==''||date_to_value==''){
            alert('Select date');
        }
        else if(date_to<date_from){
            alert('Error in date selection!');
        }
        else{
            // check whether any meal is checked,
            // if not, alert;
            // else, add meals to files, perhaps update the schedule at bottom
            const to_breakfast = document.getElementById('to_breakfast').checked;
            const to_lunch = document.getElementById('to_lunch').checked;
            const to_dinner = document.getElementById('to_dinner').checked;
            if((!to_breakfast)&&(!to_lunch)&&(!to_dinner)){
                alert('Please select brakfast, lunch or dinner!');
            }
            else{
                // fetch('../data/scheduled_recipes.json').then(response => {
                //     if(!response.ok){
                //         throw new Error('Load data failed!');
                //     }
                //     return response.json();
                // }).then(scheduled_meals_data => {
                while(date_from<=date_to){
                    const key = `${date_from.getFullYear()}-${date_from.getMonth()+1}-${date_from.getDate()}`;
                    console.log(key)
                    console.log(typeof key)
                    if(!(key in scheduled_meals_data)){
                        scheduled_meals_data[key] = {};
                    }
                    const name_to_add = hover_div.getElementsByClassName('recipe_name')[0].innerHTML;
                    if(to_breakfast){
                        if(!('breakfast' in scheduled_meals_data[key])){
                            scheduled_meals_data[key]['breakfast'] = [];
                        }
                        scheduled_meals_data[key]['breakfast'].push(name_to_add);
                    }
                    if(to_lunch){
                        if(!('lunch' in scheduled_meals_data[key])){
                            scheduled_meals_data[key]['lunch'] = [];
                        }
                        scheduled_meals_data[key]['lunch'].push(name_to_add);
                    }
                    if(to_dinner){
                        if(!('dinner' in scheduled_meals_data[key])){
                            scheduled_meals_data[key]['dinner'] = [];
                        }
                        scheduled_meals_data[key]['dinner'].push(name_to_add);
                    }

                    date_from.setDate(date_from.getDate()+1);

                }
                console.log(scheduled_meals_data);
                console.log(JSON.stringify(scheduled_meals_data));
                sessionStorage.setItem("scheduledRecipes", JSON.stringify(scheduled_meals_data));
                console.log(sessionStorage.getItem("scheduledRecipes"));
                update_schedule(new Date(current_date_start.getTime()));
                //alert('TODO: Save data.');
                    // saveJsonToFile(scheduled_meals_data,'../data/scheduled_recipes.json');
                // })
            }
        }
    });



    let scheduled_meals = JSON.parse(sessionStorage.getItem("scheduledRecipes")) || {};
    scheduled_meals_data = scheduled_meals;
    console.log(scheduled_meals_data)
    update_schedule(new Date(current_date_start.getTime()));

    document.getElementsByClassName('left_arrow')[0].addEventListener('click',(event)=>{
        current_date_start.setDate(current_date_start.getDate()-7);
        update_schedule(new Date(current_date_start.getTime()));
    });

    document.getElementsByClassName('right_arrow')[0].addEventListener('click',(event)=>{
        current_date_start.setDate(current_date_start.getDate()+7);
        update_schedule(new Date(current_date_start.getTime()));
    });


}
