/*
 * DATE: MARCH 30, 2018.
 * 
 * */
 
var request = require("request");
var base64 = require('base-64');
var i2b = require("imageurl-base64");
var utf8 = require('utf8');
var cheerio = require('cheerio');
var escapeString = require('sql-escape')
var fs = require('fs');
var faker = require('faker');
var sha256 = require('sha256');

var food = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAA8AD4DAREAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUGAgQHCAP/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/2gAMAwEAAhADEAAAAfVIAAAABAGJYQAVe5hpdlPkay7q3kjjyfrHec2UMzl5zxr2EeddSmJ2zKBJoqRSC0L1k5aSqRJtGgF7GW9RgQxmS5kAAAAD/8QAIxAAAgICAQMFAQAAAAAAAAAABAUCAwEGABITFBARICUwIv/aAAgBAQABBQL82LipfFW4rZw+DJ1Eaz+ieWJKTaaUo4dV0pLYaxtY+yUcZGxWr1R5VxaSXkiZN7PKSPIlsJOe4GRNMTHOJY2x+QXZTX0R0yX0xxWe8iI6ydhp+yL9pwW7sSuHfakI8zdqjdXxW4wtotvFvmAxoBvaMMMiRNKZtsJNXCR0+k4RsxNEtszWmX08jHEcfl//xAAUEQEAAAAAAAAAAAAAAAAAAABg/9oACAEDAQE/AQH/xAAUEQEAAAAAAAAAAAAAAAAAAABg/9oACAECAQE/AQH/xAAwEAABAwIDBQcDBQAAAAAAAAABAgMRAAQSITETIjJBUQUQFCMwUmEgYpFxcoGxsv/aAAgBAQAGPwL0wTC84O8MqKgAjOEyob307BqC9zJ0TUvLLv66fisK0SjWBlWzbbhEzBzorbfLITyOafxRw+Vco42j3XN0vhZbU4f4FG4fUVF/eWOhrH8xSs9O5xsmmb1vJTSpP3J5igRoavLBwbJlSlMIE6/JoDhUKE+9VXQ6OK/ukg+2lT0rB1pvCz4u2A2cTnIraHyn/cOdRhT2gx1HEK2Kwm313HVgGnVeK41FRigoXCVZRvZVLKF3LkYYtyFf5mjto7PYOo1WoVgbTtFc1r74UkKHQ1Kuz7VR6llNeXY2yP2tJFQBA+PT/8QAJBABAAIBAgUFAQAAAAAAAAAAAQARITFRQWFxgZEQMKGxwSD/2gAIAQEAAT8h9ur7cEutlYhzF1ht/KNMbeul7vKFwneD+rELDJyHLtrEBWVlFuuunSDFa1vKvypRPqGczc9PJHhYwYwDHCW48s1DZcdoaGAke0wI3iyWRNaEv+OE3c/a4rVhYw3O2n4orRTfRjoCKklnE/vBAcBPKcDF4Q+hD8sCNSaDeaOQg01F6YKHyTOCy9YwrJ0lTRtLa9sZfEC1RVYK24UfiU8jSAgreKjUIQsD5SYvgpzF8zjtLY41r2S3IcsTM2lBFc3pw9eS82ycx/M/UdtXf6QlGW0K9v8A/9oADAMBAAIAAwAAABCSSSSSSSSWUiQO0mQem2zqmkGQSCSSSST/xAAZEQACAwEAAAAAAAAAAAAAAAABEQAgMED/2gAIAQMBAT8Q4SVgbnBRVUXD/8QAGREAAgMBAAAAAAAAAAAAAAAAAREAIEAw/9oACAECAQE/EMID4C4Qju48/wD/xAAjEAEAAgAEBwEBAAAAAAAAAAABABEQICExMEFRYYGh8JHx/9oACAEBAAE/EOGy9RXT0HWofhokDV1m8rSxIr6AwMdMVQ4TuM0vGSs3knr0YLTvlN8NU446KnzVecyd4N31PgT3NIM03IBfAcSRhtkSxi/npz+d5OEP7e3Tr52d/wDbqN9s10lOxE1O6Q/YbklEr6N27kek7jz2xzrPdr+87IqYmyK1ROk7nRlubyCVUoK3WL1U1Qt4Z/aIjM9+zs9M5qcoD8OH/9k=";
var maleProfilePic = "data:image/png;base64,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";
var femaleProfilePic = "data:image/png;base64,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";

getRecipe = function(counter){
    return new Promise(function(resolve, reject){
        request("https://www.bigoven.com/recipe/"+counter, function(err, response, data){
            resolve(data);
        });
    });
}


const file = "platr.sql";
const numberOfAccounts = 105000;
const numberOfRecipies = 570000;


createTables = function(){
    return new Promise(function(resolve, reject){
        fs.appendFile(file, `
CREATE TABLE accounts (
    aid int(11) NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    password varchar(65) NOT NULL,
    salt varchar(20) NOT NULL,
    fname varchar(255) NOT NULL,
    lname varchar(255) NOT NULL,
    dob date NOT NULL,
    diet varchar(20) NOT NULL,
    sex varchar(7) NOT NULL,
    pic longtext,
    created_date DATE AS (DATE(ts)),
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email),
    PRIMARY KEY (aid)
);

CREATE TABLE recipes (
    rid int(11) NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    serves int(11) NOT NULL,
    preptime varchar(50) NOT NULL,
    description longtext,
    image longtext,
    calories longtext,
    is_personal int(1) NOT NULL DEFAULT '0',
    created_date DATE AS (DATE(ts)),
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name),
    PRIMARY KEY (rid)
);

CREATE TABLE directions (
    direction_id int(11) NOT NULL AUTO_INCREMENT,
    rid int(11) NOT NULL,
    step_no int(11) NOT NULL,
    step longtext NOT NULL,
    FOREIGN KEY (rid) REFERENCES recipes (rid) ON DELETE CASCADE,
    PRIMARY KEY (direction_id)
); 

CREATE TABLE facts (
    fid INT(11) NOT NULL AUTO_INCREMENT,
    rid int(11) NOT NULL,
    calories varchar(255) NOT NULL,
    sugar varchar(255) NOT NULL,
    fat varchar(255) NOT NULL,
    cholesterol varchar(255) NOT NULL,
    saturatedFat varchar(255) NOT NULL,
    transFat varchar(255) NOT NULL,
    carbs varchar(255) NOT NULL,
    sodium varchar(255) NOT NULL,
    fibre varchar(255) NOT NULL,
    protein varchar(255) NOT NULL,
    serving varchar(255) NOT NULL,
    UNIQUE (rid),
    FOREIGN KEY (rid) REFERENCES recipes (rid) ON DELETE CASCADE,
    PRIMARY KEY(fid)
);

CREATE TABLE ingredients (
    id int(11) NOT NULL AUTO_INCREMENT,
    rid int(11) NOT NULL,
    ingredient_id int(11) NOT NULL,
    ingnum int(11) NOT NULL,
    ingredient longtext NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_id varchar(255) NOT NULL,
    UNIQUE (rid,ingnum),
    FOREIGN KEY (rid) REFERENCES recipes (rid) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients_list (iid) ON DELETE CASCADE,
    PRIMARY KEY (id)
); 

CREATE TABLE ingredients_list (
    iid int(11) NOT NULL AUTO_INCREMENT,
    ingredient varchar(255) NOT NULL,
    PRIMARY KEY (iid)
);

CREATE TABLE measurements (
    unit_id int(11) NOT NULL AUTO_INCREMENT,
    unit varchar(20) NOT NULL,
    PRIMARY KEY (unit_id)
); 

CREATE TABLE kitchen (
    kid int(11) NOT NULL AUTO_INCREMENT,
    account_id int(11) NOT NULL,
    ingredient varchar(255) NOT NULL,
    stock decimal(10,3) NOT NULL,
    unit_id INT(11),
    FOREIGN KEY (unit_id) REFERENCES measurements (unit_id),
    FOREIGN KEY (account_id) REFERENCES accounts (aid),
    UNIQUE(account_id, ingredient),
    PRIMARY KEY (kid)
); 

CREATE TABLE meal (
    mid int(11) NOT NULL AUTO_INCREMENT,
    account_id int(11) NOT NULL,
    recipe_id int(11) NOT NULL,
    UNIQUE (account_id,recipe_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes (rid),
    FOREIGN KEY (account_id) REFERENCES accounts (aid),
    PRIMARY KEY (mid)
);

CREATE TABLE meal_plans (
    planid int(11) NOT NULL AUTO_INCREMENT,
    planname varchar(255) DEFAULT 'default',
    account_id int(11) NOT NULL,
    created_date DATE AS (DATE(ts)),
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
    UNIQUE (planname, account_id),
    FOREIGN KEY (account_id) REFERENCES accounts (aid),
    PRIMARY KEY(planid)
); 

CREATE TABLE planned_meals (
    pmid int(11) NOT NULL AUTO_INCREMENT,
    planid int(11) NOT NULL,
    mid int(11) NOT NULL,
    dte date NOT NULL,
    tme varchar(7) NOT NULL,
    FOREIGN KEY (mid) REFERENCES meal (mid),
    FOREIGN KEY (planid) REFERENCES meal_plans (planid),
    PRIMARY KEY (pmid)
);
INSERT INTO supermarket_list (account_id, ingredient, ingredient_id, quantity, measurement) SELECT kitchen.account_id, ingredients.ingredient, ingredient.ingredient_id, ingredients.quantity, unit_id FROM planned_meals JOIN meal JOIN kitchen JOIN ingredients WHERE planned_meals.mid = meal.mid AND ingredients.rid = meal.recipe_id AND ingredients.ingredient != "" AND ingredients.ingredient NOT LIKE CONCAT("%",kitchen.ingredient,"%") GROUP BY ingredients.ingredient HAVING count(*) = (SELECT count(*) FROM kitchen);
CREATE TABLE supermarket_list (
    itemid int(11) NOT NULL AUTO_INCREMENT,
    planid int(11) NOT NULL,
    ingredient_id int(11) NOT NULL,
    ingredient LONGTEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    measurement_id int(11) NOT NULL,
    FOREIGN KEY (planid) REFERENCES meal_plans (planid),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients_list (iid),
    FOREIGN KEY (measurement_id) REFERENCES measurements (unit_id),
    PRIMARY KEY (itemid)
); 


INSERT INTO ingredients_list (iid, ingredient) VALUES (1, "");

INSERT INTO measurements (unit_id, unit) VALUES
(1, 'x'),
(2, 'cup'),
(3, 'teaspoon'),
(4, 'tablespoon'),
(5, 'oz'),
(6, 'pinch'),
(7, 'can'),
(8, 'clove'),
(9, 'lb'),
(10, 'kg'),
(11, 'g'),
(12, ''),
(13, 'tsp'),
(14, 'tbsp'),
(15, 'ounces'),
(16, 'c');

DELIMITER //
CREATE TRIGGER addDefaultPlans AFTER INSERT ON accounts
FOR EACH ROW
BEGIN
    INSERT INTO meal_plans (account_id) VALUES (NEW.aid);
    IF (NEW.sex = 'M') THEN
        UPDATE accounts SET pic='`+maleProfilePic+`' WHERE aid = NEW.aid;
    ELSE
        UPDATE accounts SET pic='`+femaleProfilePic+`' WHERE aid = NEW.aid;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER updateSupermarketList AFTER INSERT ON planned_meals
FOR EACH ROW
BEGIN
    DELETE FROM supermarket_list WHERE account_id = (SELECT account_id from meal_plans WHERE meal_plans.planid = NEW.planid);
    INSERT INTO supermarket_list (planid, ingredient, ingredient_id, quantity, measurement_id) SELECT planned_meals.planid, ingredients.ingredient, ingredients.ingredient_id, ingredients.quantity, measurements.unit_id FROM planned_meals JOIN meal JOIN kitchen JOIN ingredients JOIN measurements WHERE measurements.unit_id = ingredients.unit_id AND planned_meals.mid = meal.mid AND ingredients.rid = meal.recipe_id AND ingredients.ingredient != "" AND ingredients.ingredient NOT LIKE CONCAT("%",kitchen.ingredient,"%") GROUP BY ingredients.ingredient HAVING count(*) = (SELECT count(*) FROM kitchen);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getPlannedMeals(accountID int(11))
    BEGIN
        SELECT * FROM planned_meals JOIN meal ON meal.mid JOIN recipes ON rid  JOIN meal_plans ON meal_plans.planid WHERE meal_plans.planid = planned_meals.planid AND recipes.rid = meal.recipe_id AND planned_meals.mid = meal.mid AND meal.account_id = accountID GROUP BY meal.mid;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getSupermarketList(accountID int(11))
    BEGIN
        SELECT * FROM supermarket_list JOIN planned_meals JOIN meal WHERE planned_meals.planid = supermarket_list.planid AND planned_meals.mid = meal.mid AND meal.account_id = accountID GROUP by supermarket_list.itemid;
    END //
DELIMITER ;

//

        `, function(err){
            console.log("Tables Created");
            resolve(err);
        });
    })
}


generateAccounts = function(accountTable, numberOfAccounts){
    return new Promise(function(resolve, reject){
        formatDate = function(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
            return [year, month, day].join('-');
        }            
        emails = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "mailinator.com"
        ]
        diets = [
            "anything",
            "vegeterian",
            "vegan" 
        ]  
        
        var accountSql = "INSERT INTO "+accountTable+" (email, password, salt, fname, lname, dob, diet, sex) VALUES ";
        var final = "";
        
        name = "";
        salt = "";
        for(var i=0; i < numberOfAccounts; i++) {
            accountSql = "INSERT INTO "+accountTable+" (email, password, salt, fname, lname, dob, diet, sex) VALUES ";
            name = faker.name.firstName()+" "+faker.name.lastName();
            name = name.replace("'","")
            salt = sha256(faker.name.firstName()).slice(0, 10);
            accountSql += "\n('"+name.split(" ")[0]+"_"+name.split(" ")[1]+"@"+emails[Math.floor((Math.random() * 4) + 0)]+"', ";
            accountSql += "'"+sha256(faker.address.city())+"',"
            accountSql += "'"+salt+"', ";
            accountSql += "'"+name.split(" ")[0]+"',";
            accountSql += "'"+name.split(" ").slice(1, name.length)+"',";
            accountSql += "'"+formatDate(faker.date.between('1960-09-31','2018-02-28'))+"',";
            accountSql += "'"+diets[Math.floor((Math.random() * 3) + 0)]+"',";
            accountSql += "'"+["M", "F"][Math.floor((Math.random() * 2) + 0)]+"');\n";   
            final +=  accountSql;  
        }        
        resolve(final+"\n\n\n\n");
    });
}



fs.unlink(file, function(err){
    createTables().then(function(err){
        generateAccounts("accounts", 100000).then(function(sql){
            fs.appendFile(file, sql, function(err){
                console.log("Accounts Generated\n\nNow Adding Recipies...");
            });
        }).then(function(err){
                addslashes = function(string){
                    return string.replace(/[\\$'"]/g, "\\$&");
                }
                
                var inserts = 1;
                var usedIndices = [];
                var totalSuccessfullInserts = 0;
                
                setInterval(function(){
                    console.log("\n\n"+totalSuccessfullInserts+" recipies out of "+numberOfRecipies+"\n\n")
                }, 22000)
                
                createWorker = function(id, start, end, delay){
                    return new Promise(function(resolve, reject){
                        var worker = {}
                        worker[id] = setInterval(function(){
                            if(totalSuccessfullInserts >= numberOfRecipies){
                                fs.appendFile(file, `
UPDATE recipes SET image = '`+food+`';     
UPDATE accounts SET pic = '`+maleProfilePic+`' WHERE sex='M';
UPDATE accounts SET pic = '`+femaleProfilePic+`' WHERE sex='F';                           
                                `, function(err){
                                    throw new Error("Recipies added successfully!");
                                });                         
                            }
                            if(start >= end)
                               clearInterval(worker[id])           
                            console.log("request: "+start)
                                
                            new Promise(function(resolve, reject){
                                getRecipe(start).then(function(html){
                                    try{
                                        var $ = cheerio.load(html);
                                        var scripts = $('script');
                                        var recipe = ""
                                        for(var i = 0; i < scripts.length; i++){
                                            if(scripts[i]["attribs"]["type"] == "application/ld+json"){
                                                recipe = $(scripts[i]["children"]).text().replace(/(\r\n\t|\n|\r\t)/gm,"");
                                                break;
                                            }
                                        }
                                        try{
                                            recipe = JSON.parse(recipe);
                                            recipe["recipeInstructions"] = recipe["recipeInstructions"].join().split(".");
                                            resolve(recipe); 
                                        }
                                        catch(e){
                                            //console.log(e);
                                        } 
                                    }catch(e){
                                        //console.log(e);
                                    }
                                })
                            }).then(function(recipe){
                                    //console.log(recipe);
                                    new Promise(function(resolve, reject){
                                        var recipeInstructions = recipe["recipeInstructions"];
                                        if(recipeInstructions.length > 0)
                                            var directions = "INSERT INTO directions (rid, step_no, step) VALUES\n";                                       
                                        for(var i = 0; i < recipeInstructions.length; i++){
                                            if(i == recipeInstructions.length - 1){
                                                if(parseInt(recipeInstructions[i]) >= 0){
                                                }
                                                else{
                                                    directions += "("+inserts+", "+i+", '"+addslashes(recipeInstructions[i])+"');";
                                                }     
                                            }     
                                            else{
                                                if(parseInt(recipeInstructions[i]) >= 0){
                                                }
                                                else{
                                                    directions += "("+inserts+", "+i+", '"+addslashes(recipeInstructions[i])+"'),\n";
                                                }  
                                            }
                                        }   
                                        
                                        resolve([recipe, directions]);
                                    }).then(function(directionSql){
                                        //PARSE INGREDIENTS
                                        var measurements = ["x", "c.", "cup", "oz.", "can", "teaspoon.", "tablespoon.",  "pinch",  "clove", "lb.", "kg.", "g", " ",  "tsp.", "tbps.", "ounces."]
                                        var ingredients = directionSql[0]["recipeIngredient"];
                                        if(ingredients.length > 0)
                                            var ingredientSql = "INSERT INTO ingredients (rid, ingredient_id, ingnum, ingredient, quantity, unit_id) VALUES \n";
                                        var splittedIng = "";
                                        var totalIng = 0;
                                        for(var i = 0; i < ingredients.length; i++){
                                            var splittedIng = ingredients[i].split(" ");
                                            if(parseInt(splittedIng[1][0]) >= 0){
                                                //INGREDIENT HAS A FRACTIONAL COMPONENT
                                                totalIng = eval(splittedIng[0]) + eval(splittedIng[1]);
                                                if(i == ingredients.length - 1){
                                                    for(var j = 0; j < measurements.length; j++){
                                                        if(measurements[j].indexOf(splittedIng[2].toLowerCase()) >= 0){
                                                            ingredientSql += "("+inserts+", 1, "+i+", '"+addslashes(splittedIng.slice(3).join(" "))+"', "+totalIng.toFixed(2)+", "+j+1+");\n";
                                                            break;
                                                        }
                                                        if(j == measurements.length - 1){
                                                            ingredientSql += "("+inserts+", 1, "+i+", '"+addslashes(splittedIng.slice(3).join(" "))+"', "+totalIng.toFixed(2)+", "+11+");\n";
                                                            break;                                                        
                                                        }
                                                    }  
                                                }
                                                else{
                                                    for(var j = 0; j < measurements.length; j++){
                                                        if(measurements[j].indexOf(splittedIng[2].toLowerCase()) >= 0){
                                                            ingredientSql += "("+inserts+", 1, "+i+", '"+addslashes(splittedIng.slice(3).join(" "))+"', "+totalIng.toFixed(2)+", "+j+1+"),\n";
                                                            break;
                                                        }
                                                        if(j == measurements.length - 1){
                                                            ingredientSql += "("+inserts+", 1, "+i+", '"+addslashes(splittedIng.slice(3).join(" "))+"', "+totalIng.toFixed(2)+", "+11+"),\n";
                                                            break;                                                        
                                                        }
                                                    }   
                                                }
                                              
                                            }
                                            else{
                                                if(i == ingredients.length - 1){
                                                    for(var j = 0; j < measurements.length; j++){
                                                        if(measurements[j].indexOf(splittedIng[2].toLowerCase()) >= 0){
                                                            ingredientSql += "("+inserts+", 1, "+i+", '"+addslashes(splittedIng.slice(3).join(" "))+"', "+totalIng+", "+j+1+");\n";
                                                            break;
                                                        }
                                                        if(j == measurements.length - 1){
                                                            ingredientSql += "("+inserts+", 1, "+i+", '"+addslashes(splittedIng.slice(3).join(" "))+"', "+totalIng+", "+11+");\n";
                                                            break;                                                        
                                                        }
                                                    }  
                                                }
                                                else{
                                                    for(var j = 0; j < measurements.length; j++){
                                                        if(measurements[j].indexOf(splittedIng[2].toLowerCase()) >= 0){
                                                            ingredientSql += "("+inserts+", 1, "+i+", '"+addslashes(splittedIng.slice(3).join(" "))+"', "+totalIng+", "+j+1+"),\n";
                                                            break;
                                                        }
                                                        if(j == measurements.length - 1){
                                                            ingredientSql += "("+inserts+", 1, "+i+", '"+addslashes(splittedIng.slice(3).join(" "))+"', "+totalIng+", "+11+"),\n";
                                                            break;                                                        
                                                        }
                                                    }   
                                                }                                                
                                            }
                                        }
                                        directionSql.push(ingredientSql)
                                        return(directionSql)
                                    }).then(function(finalSql){
                                        if(usedIndices.includes(inserts) == false){
                                          fs.appendFile(file, `               
INSERT INTO recipes (rid, name, serves, preptime, description, image, calories) VALUES (`+inserts+`, '`+addslashes(finalSql[0]["name"])+`', '`+finalSql[0]["recipeYield"]+`', '`+finalSql[0]["prepTime"]+`', '`+addslashes(finalSql[0]["description"])+`', '', '`+finalSql[0]["nutrition"]["calories"].replace(" calories", "")+`');
INSERT INTO facts (rid, calories, sugar, fat, cholesterol, saturatedFat, transFat, carbs, sodium, fibre, protein, serving) VALUES (`+inserts+`, '`+addslashes(finalSql[0]["nutrition"]["calories"])+`', '`+addslashes(finalSql[0]["nutrition"]["sugarContent"])+`', '`+addslashes(finalSql[0]["nutrition"]["fatContent"])+`', '`+addslashes(finalSql[0]["nutrition"]["cholesterolContent"])+`', '`+addslashes(finalSql[0]["nutrition"]["saturatedFatContent"])+`', '`+addslashes(finalSql[0]["nutrition"]["transFatContent"])+`', '`+addslashes(finalSql[0]["nutrition"]["carbohydrateContent"])+`', '`+addslashes(finalSql[0]["nutrition"]["sodiumContent"])+`', '`+addslashes(finalSql[0]["nutrition"]["fiberContent"])+`', '`+addslashes(finalSql[0]["nutrition"]["proteinContent"])+`', '`+addslashes(finalSql[0]["nutrition"]["servingSize"])+`');
`+finalSql[1]+` 
`+finalSql[2]+`                     `, function(err){
                                                if( err){
                                                    console.log(err);
                                                }
                                                usedIndices.push(inserts);
                                                totalSuccessfullInserts++;
                                                console.log("recipe added: -> "+start);
                                            }) 
                                        }
                                        inserts++;
                                    })                                   
                            })
                            start++;
                        },  delay);
                    })
                }
                
                createWorker(0, 0, 100000, 1000);
                createWorker(2, 100000, 200000, 1000);
                createWorker(3, 200000, 300000, 1000);
                createWorker(4, 300000, 400000, 1000);
                createWorker(5, 400000, 500000, 1000);
                createWorker(6, 500000, 600000, 1000);
                createWorker(7, 600000, 700000, 1000);
                createWorker(8, 700000, 800000, 1000);
                createWorker(9, 800000, 900000, 1000);
                createWorker(10, 900000, 1000000, 1000);
                createWorker(11, 1000000, 1100000, 1000);
                createWorker(12, 1100000, 1300000, 1000);
                createWorker(13, 1300000, 1400000, 1000);
                createWorker(14, 1400000, 1500000, 1000);
                createWorker(15, 1500000, 1600000, 1000);
                createWorker(16, 1600000, 1700000, 1000);
                createWorker(17, 1700000, 1900000, 1000);
                createWorker(18, 1900000, 2000000, 1000);
                createWorker(19, 2000000, 2100000, 1000);
        })
    });
})







