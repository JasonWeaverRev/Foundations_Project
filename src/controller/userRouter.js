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
const ticketService = require("../service/ticketService"); 






/**
 * USERS
 */

// Register a new user
userRouter.post('/', async (req, res) => {
    const data = await userService.postUser(req.body);

    if (data) {
        res.status(201).json({message: `Successfully created new user`, UserInformation: req.body});
    } else {
        res.status(400).json({message: `Error: User could not be created`, receivedData: req.body});
    }
});

// Login
userRouter.post('/sessions', async (req, res) => {
    

    const token = await userService.loginUser(req.body);
    if(token) {
        res.status(200).json({message: `Login successful: ${token}`});
    } else {
        res.status(400).json({message : "Please enter a valid username and password"});
    }
});








/**
 * TICKETS
 **/

// Submit Ticket Request
userRouter.post('/tickets', authenticateToken, async (req, res) => {
    const ticket = await ticketService.postTicket(req.body, req.user);

    if (ticket) {
        res.status(201).json({message: `Created new ticket`, Ticket: req.body});
    } else {
        res.status(400).json({message: `Error: Ticket could not be created`, receivedData: req.body});
    }
});

// Get tickets from a user
userRouter.get('/tickets', authenticateToken, async (req, res) => {

    const tickets = await ticketService.getUserTickets(req.user);

    if (tickets) {
        res.status(200).json(tickets);
    } else {
        res.status(404).json({message: `Error: Tickets not found`, receivedData: req.body});
    }
});

// Get tickets from ALL users. FM level access only
userRouter.get('/fm', authenticateAdminToken, async (req, res) => {

    const tickets = await ticketService.getAllUserTickets();

    if (tickets) {
        res.status(200).json(tickets);
    } else {
        res.status(404).json({message: `Error: Tickets not found`});
    }
});

// Get the earliest, pending ticket from the ticket queue
userRouter.get('/fm/queue', authenticateAdminToken, async (req, res) => {
    
    const ticket = await ticketService.getEarliestPendingTicket();

    if (ticket) {
        res.status(200).json(ticket);
    } else {
        res.status(404).json({message: `Error: Could not find pending ticket`});
    }
});

// Change the status of the earliest, pending ticket from the ticket queue
userRouter.put('/fm/queue', authenticateAdminToken, async (req, res) => {
    
    const data = await ticketService.setTicketStatus(req.body);

    if (data) {
        res.status(200).json({message: `Status of the ticket succesfully changed to: ${req.body.Status}`});
    } else {
        res.status(400).json({message: `Error: Unable to change ticket status`});
    }
});





/**
 * AUTHENTICATION
 */

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
            res.status(403).json({message: "Forbidden Access. Finance manager users only"});
            return;
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