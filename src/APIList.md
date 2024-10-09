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


//////////////pagination

/feed?page=1&limit=10     !1 to 10
/feed?page=2&limit=10     !11 to 20
/feed?page=3&limit=10     !11 to 20