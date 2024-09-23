/**
 * Performs business logic for the User DB
 */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userDAO = require("../repository/userDAO");
const ticketDAO = require("../repository/ticketDAO");
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

/**
 * Submit a reimbursement ticket to the ticket DB
 * 
 * @param {*} ticket 
 * @param {*} user 
 * @returns 
 */
async function postTicket(ticket, user) {
 
    // Post ticket information
    let data = await ticketDAO.postTicket({
        TicketID: uuid.v4(),
        ...ticket,
        Employee_Username: user.Username,
        Time_Submitted: Date.now()
    });
    return data;

}


// LOGIN

async function loginUser(user) {
    // Find the user within the User DB
    const foundUser = await userDAO.getUser(user.Username); 

    // Validate Username and Password
    // Invalid Case
    if (!foundUser) {
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




module.exports = {
    postUser,
    getAllUsers,
    getUser, 
    loginUser,
    postTicket
}