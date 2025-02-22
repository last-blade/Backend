const asyncHandler = (func) => {
    return (request, response, next) => {
        Promise.resolve(func(request, response, next))
        .catch((error) => next(error))
    }
}

export {asyncHandler};








//anthor way to write above function w/o return statement.
// const asyncHandler = (func) => (req, res, next) => Promise.resolve(func(req, res, next)).catch(next);
/*
Breakdown:
1. It takes an async function "(func)" as an argument.
2. Returns a new function that Express can use as a middleware or route handler.
3. Calls func(req, res, next) and wraps it inside Promise.resolve(), ensuring it catches any rejected promises.
4. If an error occurs, it automatically passes it to next(), so the global error handler in Express can handle it.
Why Use It?
Without asyncHandler, you would need to wrap every async route in a try-catch block, making your code repetitive. 
This middleware simplifies error handling.
*/


/*
oopar wale function ko kaise likhna hai, step-wise see below
Step:1-> pehle simple arrow function likho
const asyncHandler = () => {
        
}

Step:2->fir parameter paas accept karo, jo ki khud ek function hai parameter
const asyncHandler = (func) => {
        
}

Step:3-> fir uske andar ek or function banao
const asyncHandler = (func) => {
        return (request, response, next) => {
        
        }
}

Step:4->
const asyncHandler = (func) => {
        return (request, response, next) => {
            Promise.resolve(func())
            .catch((error) => next(error))
        }
}

Step:5->
const asyncHandler = (func) => {
        return (request, response, next) => {
            Promise.resolve(func(request, response, next)))
            .catch((error) => next(error))
        }
}
*/






/*

//Question:-> Ab yeh "asyncHandler" maine kyon likha hai ?
//Answer:-> "asyncHandler" isliye banaya hai taaki error handling automate ho sake jab hum async/await use kar rahe hote 
            hain. Agar hum try-catch har async function ke andar likhenge, toh code repetitive aur messy ho jayega.
            "asyncHandler" banane ka main reason yeh hai ki: ✅ Har async function ke andar baar-baar try-catch likhne ki zaroorat na pade.
            ✅ Code clean aur readable rahe.
            And "asyncHandler" ek "higher order function" hai because yeh ek function ko as a parameter accept kar raha hai,
            or koi aisa function jo kisi doosre function ko as a parameter accept karta hai usko hum "higher order func" kehte hain.


// try-catch ke use kar ke "asyncHandler" likha hai neeche and, oopar hum promise kaa use karke asyncHandler likhenge, dono hi sahi tareeke hain             
const asyncHandler = (func) => async (request, response, next) => {
    try {
        await func(request, response, next)
    } catch (error) {
        response.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
*/