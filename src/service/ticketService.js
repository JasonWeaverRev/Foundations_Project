/**
 * Performs business logic for the Ticket DB
 */
const uuid = require("uuid");
const ticketDAO = require("../repository/ticketDAO");



/**
 * Submit a reimbursement ticket to the ticket DB
 * 
 * @param {*} ticket 
 * @param {*} user 
 * @returns 
 */
async function postTicket(ticket, user) {
    
    if (await validateTicket(ticket)) {
        // Post ticket information
        let data = await ticketDAO.postTicket({
            TicketID: uuid.v4(),
            ...ticket,
            EmployeeUsername: user.Username,
            TimeSubmitted: String(Date.now()),
            Status: "Pending"
        });
        return data;
    }

    return null;
}

/**
 * Retrieve a list of all tickets from a user
 * 
 * @param user User metadata to get tickets from
 * @returns A list of all tickets with the same employee username
 */
async function getUserTickets(user) {

    const tickets = await ticketDAO.getUserTickets(user.Username);
    return tickets;
}

/**
 * Retrieve ALL tickets
 * 
 * @returns A list of all tickets with the same employee username
 */
async function getAllUserTickets() {

    const tickets = await ticketDAO.getAllUserTickets();
    return tickets;
}

/**
 * Retrieve the earliest ticket in queue labelled "Pending"
 * 
 * @returns The earliest ticket in queue labelled "Pending". Null otherwise
 */
async function getEarliestPendingTicket() {

    const tickets = await ticketDAO.getAllUserTickets();
    return tickets;
}

/**
 * Sets the status of the earliest ticket labelled "Pending" to either "Approved" or "Denied".
 * 
 * @returns The ticket if its respective ticket status was changed. Otherwise null
 */
async function setTicketStatus(statusRequest) {

    return ticket;
}

/**
 * Validates a ticket request. A ticket is valid if it has an amount and description
 * 
 * @param {*} ticket Ticket to evaluate
 * @returns True if the ticket
 */
async function validateTicket(ticket) {
   
    return (ticket.Amount && ticket.Description);

}


module.exports = {
    postTicket,
    getUserTickets,
    getAllUserTickets,
    getEarliestPendingTicket,
    setTicketStatus
}