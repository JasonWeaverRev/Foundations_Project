/**
 * Controller class that will facilitate interaction between the client and user repository
 */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const userRouter = express.Router();
const app = express();

// Retrieving secret key for data encoding
const secrets = require("../../secrets.json");
const secretKey = secrets.secretKey;

const userService = require("../service/UserService");


// Register a new user
userRouter.post('/', async (req, res) => {
    const data = await userService.postUser(req.body);
    if (data) {
        res.status(201).json({message: `Created new user: ${JSON.stringify(req.body)}`});
    } else {
        res.status(400).json({message: `Error: User could not be created`, receivedData: req.body});
    }
});

// Get all users 
userRouter.get('/',async (req, res) => {
    const users = await userService.getAllUsers();
    if(users) {
        res.status(200).json({users});
    } else {
        res.status(400).json({message : "Failed to get all users"});
    }
});


// Login
userRouter.post('/session', async (req, res) => {
    

    const token = await userService.loginUser(req.body);
    if(token) {
        res.status(200).json({message: `Login successful: ${token}`});
    } else {
        res.status(400).json({message : "Invalid login credentials"});
    }
});



// Get a single user by username
// Test method
userRouter.get('/single', authenticateToken, async (req, res) => {
    
    const user = await userService.getUser(req.body);
    if(user) {
        res.status(200).json({user});
    } else {
        res.status(400).json({message : "Failed to get user"});
    }
});





// ACCESS TOKENS
// Authenticate JWT
async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({message: "Unauthorized Access"});
    } else {
        
        const user = await decodeJWT(token);
        req.user = user;
        next();
    }

}
// Authenticate Admin level JWT
async function authenticateAdminToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({message: "Unauthorized Access"});
    } else {

        const user = await decodeJWT(token);
        if (user.Role !== "FM") {
            res.status(403).json({message: "Forbidden Access. Only manager roles or higher status are permitted"});
        }
        req.user = user;
        next();
    }
}

// Decode a JWT
async function decodeJWT(token) {
    try {
        const user = await jwt.verify(token, secretKey);
        return user;

    } catch(err) {
        console.error(err);
    }
    
}


module.exports = userRouter;