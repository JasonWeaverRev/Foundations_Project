/**
 * Performs business logic for the User DB
 */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userDAO = require("../repository/userDAO");
const uuid = require("uuid");

// Retrieving secret key for data encoding
const secrets = require("../../secrets.json");
const secretKey = secrets.secretKey;


/**
 * Creates a new user in the User table if valid
 * 
 * @param {*} user Newly created User, not yet registered
 * @returns Metadata of the user post request. Null if the user was not created
 */
async function postUser(user) {

    if(await validateUser(user)) {

        // Hash new user
        const saltRounds = 10;
        user.Password = await bcrypt.hash(user.Password, saltRounds);

        console.log(user.Password);

        // Post user information
        let data = await userDAO.postUser({
            UserID: uuid.v4(),
            ...user,
        });
        return data;
    }

    // Invalid user credentials for user registration
    return null;
}


/**
 * Retrieve a list of all users
 * 
 * @returns A list of all users from the Users table
 */
async function getAllUsers() {
    const users = await userDAO.getAllUsers();
    return users;
}

async function getUser(user) {
    const foundUser = await userDAO.getUser(user.Username);
    return foundUser;
}


/**
 * If the user has a UNIQUE username and password and user, the user is valid
 * TODO: username unique-ness
 * 
 * @param {*} user User to be validated
 * @returns True if the user is valid, false if invalid
 */
async function validateUser(user) {
   
    return (user.Username && user.Password && user.Role && !(await userDAO.getUser(user.Username)));

}




// LOGIN

async function loginUser(user) {
    // Find the user within the User DB
    const foundUser = await userDAO.getUser(user.Username); 

    // Validate Username and Password
    // Invalid Case
    if (!foundUser.Username) {
        return null;
    }
    else if (!await bcrypt.compare(user.Password, foundUser.Password)) {
        return null;
    }
    // Valid Case
    else {
        const token = jwt.sign(
            {
                UserID: foundUser.UserID,
                Username: foundUser.Username,
                Role: foundUser.Role
            },
            secretKey,
            {
                expiresIn: "2h",
            }


        )

        return token;
    }
}

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



module.exports = {
    postUser,
    getAllUsers,
    getUser, 
    loginUser,
    authenticateAdminToken,
    authenticateToken
}