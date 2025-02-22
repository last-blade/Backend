class apiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode // Stores HTTP status code (e.g., 200, 400, 500)
        this.data = data  // Stores actual response data (e.g., user info, list, etc.)
        this.message = message  // Stores a success or failure message
        this.success = statusCode < 400 // If statusCode is below 400, it's a success (true); otherwise, false
    }
}

export {apiResponse}