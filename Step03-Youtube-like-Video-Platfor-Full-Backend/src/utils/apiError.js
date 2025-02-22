class apiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
    
        if(stack){
            this.stack = stack
        }

        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { apiError }

/*
--> What is This Code Doing?
This code defines a custom error class called apiError. It's useful in backend applications to handle errors in a structured way.


--> Step 1: Understanding JavaScript's Error Class
    JavaScript has a built-in Error class that is used to create error objects. 

    Example:
    const err = new Error("Something went wrong");
    console.log(err.message); // Output: Something went wrong
    console.log(err.stack);   // Output: Stack trace of where the error occurred
    The Error class helps in debugging by providing messages and stack traces.

--> Step 2: Creating a Custom Error Class
    We extend (inherits from) the built-in Error class to customize it for API error handling.
    Code Breakdown: class apiError extends Error {}
    This creates a new class apiError, which inherits the built-in Error class of Nodejs.
    Now, apiError behaves like an error but has additional properties.

--> Step 3: Constructor - Defining Custom Error Properties
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);

    "super(message)" calls the Error constructor, ensuring the error message is stored.
    We define additional properties to make API error handling easier:
    "statusCode": Stores HTTP error status (e.g., 404 for Not Found, 500 for Server Error).
    "message": Stores the error message (default: "Something went wrong").
    "errors": Stores additional error details (like validation errors).
    "stack": Stores the error stack trace (used for debugging).

--> Step 4: Assigning Values
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

   " this.statusCode" → Stores the HTTP status code (e.g., 400 for Bad Request).
   " this.data = null" → Placeholder for additional data (not used in this case).
    "this.success" = false → Indicates that this is an error response.
   " this.errors" = errors → Stores extra error details.

--> Step 5: Handling the Stack Trace
    if (stack) {
        this.stack = stack;
    } else {
        Error.captureStackTrace(this, this.constructor);
    }
        
    If stack is provided, it stores it.
    Otherwise, Error.captureStackTrace() generates a stack trace for debugging.
*/