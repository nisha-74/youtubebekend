class ApiResponse{
    constructor(statuCode, data, message= "message"){
        this.statuCode= statuCode, 
        this.data= data, 
        this.message= message
        this.success= statuCode < 400 
    }
}
export{
    ApiResponse
}