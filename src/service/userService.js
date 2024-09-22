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

    // Validate the user
    if(validateUser(user)) {

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
function validateUser(user) {
    return (user.Username && user.Password && user.Role);
}

// LOGIN

async function loginUser(user) {
    console.log(user);
    const {Username, Password} = user;

    // Find the user within the User DB
    const foundUser = userDAO.getUser(Username); 
    console.log(foundUser);

    // Validate Username and Password
    // Invalid Case

    console.log(Password);

    if (!foundUser.Username) {
        return null;
    }
    else if (!await bcrypt.compare(Password, foundUser.Password)) {
        return null;
    }
    // Valid Case
    else {
        const token = jwt.sign(
            {
                UserID: user.UserID,
                Username: user.Username,
                Role: user.Role
            },
            secretKey,
            {
                expiresIn: "2h",
            }


        )

        return token;
    }
}

module.exports = {
    postUser,
    getAllUsers,
    getUser, 
    loginUser
}