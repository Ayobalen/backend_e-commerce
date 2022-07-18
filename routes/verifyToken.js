const jwt = require("jsonwebtoken")

const verifyToken = function(req, res, next){
    const authHeader = req.headers["authorization"];
    if (authHeader) {
    const token = authHeader.split(" ")[1]
jwt.verify(token, process.env.JWT_SEC, function(err,user){
    if(err) res.status(403).json("Token isn't valid!");
req.user = user;
next(); 
});
}else
    return res.status(401).json("you are not authenticated!");
}; 

const verifyTokenAndAuthorization =  function(req, res, next){
    try{
        verifyToken( req, res, function(){
            if(req.user._id === req.params.id || req.user.isAdmin){
                next();
            } else { 
               res.status(403).json("you are not allowed to do that!");
            }
        });
    }
catch(err){
    res.status(500).json(err);
};
};

    const verifyTokenAndAdmin =  function(req, res, next){
            verifyToken( req, res, function(){
                if(req.user.isAdmin){
                    next();
                } else { 
                   res.status(403).json("you are not allowed to do that!");
                }
            });
        }; 
        
module.exports = { verifyToken, verifyTokenAndAuthorization,  verifyTokenAndAdmin };