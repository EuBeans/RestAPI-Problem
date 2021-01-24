const Pool = require('pg').Pool

const data = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'api',
  password: 'admin',
  port: 5432,
})

var d1 = new Date();

//ENDPOINT: create new recipe
const createNewRecipe = (request, response) =>{
    const id = parseInt(request.params.id)
    const{content,isprivate,ispremium,category} = request.body
    const req = request.body;
    const date = d1.toLocaleDateString();


    var param = ["content","isprivate","ispremium","category"];

    for(var key in req){
      if(param.includes(key) == false){
        console.log(key)
        throw "Error: Paramater not requested";
      }
    }

    data.query('INSERT INTO recipes (author,content,isprivate,ispremium,category, created_date,last_update_date) VALUES ($1,$2,$3,$4,$5,$6,$7)', [id,content,isprivate,ispremium,category,date,date],(error,results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}


//ENDPOINT: update existing recipe 
const updateRecipe = (request, response) => {
    const id = parseInt(request.params.id)
    const { content, category, ispremium, isprivate, recipeID} = request.body

    const date = d1.toLocaleDateString();
  
    data.query(
      'UPDATE recipes SET content = $1, category = $2, ispremium =$3, isprivate=$4, last_update_date=$5 WHERE author = $6 AND recipeID = $7',
      [content, category, ispremium, isprivate, date, id, recipeID],

      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Recipe modified with ID: ${recipeID}`)

      }
    )
  }

//ENDPOINT: delete existing recipe
  const deleteRecipe = (request, response) => {
    const id = parseInt(request.params.id)
    const {recipeID} = request.body
  
    data.query('UPDATE recipes SET isdeleted = true WHERE recipeid = $1 AND author = $2', [recipeID, id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Recipe deleted with recipe ID: ${recipeID}`)
    })
  }


//ENDPOINT: update user to premium
  const UpdateToPremium = (request, response) => {
    const id = parseInt(request.params.id)
    const {str} = request.body
  
    data.query(
      'UPDATE users SET ispremium = true WHERE id = $1',
      [id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
  }

  //ENDPOINT: update user to premium
  const UpdateToNonPremium = (request, response) => {
    const id = parseInt(request.params.id)
    const {str} = request.body
  
    data.query(
      'UPDATE users SET ispremium = false WHERE id = $1',
      [id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
  }


//ENDPOINT: get list of users
    const getListOfRecipes = (request, response) => {
    const id = parseInt(request.params.id);
 
  
    //id is included
    if(!id){
      console.log("I am not here");
      data.query('SELECT * FROM recipes where isPrivate = false AND isPremium=false', (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })

    //id is excluded
    }else{
      console.log("I am here");
      data.query(
        'select * from users left join recipes on users.id = recipes.author  where  recipes.isdeleted = false and  case when  (true IN (select isPremium from users where users.id = $1) ) then  (recipes.isprivate = false   ) when  (false IN (select isPremium from users where users.id = $1) ) then (recipes.ispremium = false and recipes.isprivate = false ) end' , 
        [id], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }    
  }

  //ENDPOINT: get recipe
  const getRecipe = (request, response) => {

    const {recipeID} = request.body

    const id = parseInt(request.params.id);

      data.query(
        'select * from users left join recipes on users.id = recipes.author where recipes.isdeleted = false and recipes.recipeid = $2 and   case  when (recipes.isprivate = true and recipes.author = $1  ) then 1=1 when  (recipes.isprivate = true  and recipes.author != $1  )  then recipes.isprivate = false when  (recipes.isprivate = false ) then 1=1 end and  case when (recipes.ispremium = true and ( true in (select ispremium from users where users.id = $1 ))) then 1=1 when  (recipes.ispremium = true and ( false in (select ispremium from users where users.id = $1 ))) then recipes.ispremium = false when  (recipes.ispremium = false  ) then 1=1 end ', 
        [id, recipeID], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }    
  
  //select * from recipes left join users on recipes.author = users.id  Where  (SELECT isPremium from users where users.id = 1) = true AND isprivate = true  

  module.exports = {
    createNewRecipe,
    updateRecipe,
    deleteRecipe,
    UpdateToPremium,
    UpdateToNonPremium,
    getListOfRecipes,
    getRecipe
  }