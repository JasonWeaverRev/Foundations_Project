/**
 * Performs business logic for the Ticket DB
 */
const uuid = require("uuid");
const ticketDAO = require("../repository/ticketDAO");



/**
 * Submit a reimbursement ticket to the ticket DB
 * 
 * @param {*} ticket ticket meta data, including a reimbursement amount and description
 * @param {*} user user the ticket is associated with
 * @returns ticket submission meta data if successfully added, null otherwise
 */
async function postTicket(ticket, user) {
    
    if (await validateTicket(ticket)) {
        // Post ticket information
        let data = await ticketDAO.postTicket({
            TicketID: uuid.v4(),
            ...ticket,
            EmployeeUsername: user.Username,
            TimeSubmitted: Date.now(),
            TicketStatus: "Pending"
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
    const tickets = await sortByTime();
    let pendTicket = null;
    
    for(let i = 0; i < tickets.length; i++) {
        if (tickets[i].TicketStatus == "Pending") {
            pendTicket = tickets[i];
            break;
        }
    }

    return pendTicket;

}

/**
 * Sets the status of the earliest ticket labelled "Pending" to either "Approved" or "Denied".
 * 
 * @returns The ticket if its respective ticket status was changed. Otherwise null
 */
async function setTicketStatus(status) {

    if(await validateStatus(status)) {

        let ticket = await getEarliestPendingTicket();
        if (ticket) {

            data = await ticketDAO.setTicketStatus(ticket.TicketID, status.Status);
        
            return ticket;
        }
        
    }

    return null;
}


/**
 * 
 * 
 * @returns List of all tickets, sorted by time
 */
async function sortByTime() {
    const tickets = await ticketDAO.getAllUserTickets();
    const ticketList = [];
    const sortedTickets = [];

    // Create a list of all tickets, attached to a time
    for (let i = 0; i < tickets.length; i++) {
        ticketList.push([tickets[i], tickets[i].TimeSubmitted]);
    }

    // Sort the list by the attached time
    ticketList.sort(function(a, b) {
        return a[1] - b[1];
    })
    
    // Create a list of all the sort tickets without the attached time
    for (let x = 0; x < ticketList.length; x++) {
        sortedTickets.push(ticketList[x][0]);
    }
    
    return sortedTickets;
}


/**
 * Validates a ticket request. A ticket is valid if it has an amount and description
 * 
 * @param {*} ticket Ticket to evaluate
 * @returns True if the ticket
 */
async function validateTicket(ticket) {
   
    return (ticket.Amount && ticket.Description && (ticket.Amount >= 0));

}

async function validateStatus(status) {
    console.log(status.Status);
    return (status.Status && (status.Status === "Denied" || status.Status === "Approved"));

}




module.exports = {
    postTicket,
    getUserTickets,
    getAllUserTickets,
    getEarliestPendingTicket,
    setTicketStatus
}