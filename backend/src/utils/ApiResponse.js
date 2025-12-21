class ApiResponse{
    constructor(statusCode, data, message="success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400
    }
}
export {ApiResponse}

// standards for statusCodes
// informational responses 100-199
// successful responses 200-299
// redirection messages 300-399
// client error responses 400-499
// server error responses 500-599
