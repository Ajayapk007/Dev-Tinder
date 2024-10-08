#DevTinder Api
authRouter
    Post/SignUp 
    Post/Login
    Post/Logout

userProfileRoute
    Patch/profile/edit/info
    get/profile/view
    Patch/profile/changePassword

connetionrouter
    post/request/send/interested/:userId
    post /request/send/ignored/:userId
    post /request/review/accepted/:requestId
    post /request/review/rejected/:requestId

Get /connection
Get /request/received
Status/ resquest:  ignore or interested, accepeted, rejected  

Get /feed/getprofilesOftherpeople
