/**
 * Representation of the Ticket Repository
 */
const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
    QueryCommand
} = require("@aws-sdk/lib-dynamodb");
const logger= require("../util/logger");

// Table and DynamoDB Document information
const client = new DynamoDBClient({region: "us-east-1"});
const documentClient = DynamoDBDocumentClient.from(client);
const TableName = "Tickets";


// POST COMMANDS

/**
 * Post new ticket.
 **/
async function postTicket(Item) {
    // Create put command to the Ticket Table, adding in a new ticket
    const command = new PutCommand( {
        TableName,
        Item
    });
    // Send command to the DB
    try {
        const data = await documentClient.send(command);
        return data;
    } catch(err) {
        logger.error(err); 
    }
}

/**
 * Retrieve a list of tickets by an employee username
 */
async function getUserTickets(username) {

    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "EmployeeUsername"},
        ExpressionAttributeValues: {":username": username}
    });
    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch(err) {
        logger.error(err);
    }
}

/**
 * Retrieve a list of ALL tickets
 */
async function getAllUserTickets() {

    const command = new ScanCommand({
        TableName
    });
    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch(err) {
        logger.error(err);
    }
}

/**
 * Change the status of a ticket
 */
async function setTicketStatus(tickID, tickStatus) {
    const command = new UpdateCommand({
        TableName,
        Key: {
            "TicketID": tickID
        },
        UpdateExpression: "set TicketStatus = :tickStatus",
        ExpressionAttributeValues: {
            ":tickStatus": tickStatus
        }
        
    });

    try {
        const data = await documentClient.send(command);
        return data;
    } catch(err) {
        logger.error(err);
    }
}


module.exports = {
    postTicket,
    getUserTickets,
    getAllUserTickets,
    setTicketStatus
}