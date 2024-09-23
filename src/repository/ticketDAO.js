// /**
//  * Representation of the Ticket Repository
//  */
// const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
// const {
//     DynamoDBDocumentClient,
//     GetCommand,
//     PutCommand,
//     UpdateCommand,
//     DeleteCommand,
//     ScanCommand,
//     QueryCommand
// } = require("@aws-sdk/lib-dynamodb");
// const logger= require("../util/logger");

// // Table and DynamoDB Document information
// const client = new DynamoDBClient({region: "us-east-1"});
// const documentClient = DynamoDBDocumentClient.from(client);
// TableName = "Tickets";


// // POST COMMANDS

// /**
//  * Post new ticket.
//  **/
// async function postTicket(Item) {
//     // Create put command to the Ticket Table, adding in a new ticket
//     const command = new PutCommand( {
//         TableName,
//         Item
//     });
//     // Send command to the DB
//     try {
//         const data = await documentClient.send(command);
//         return data;
//     } catch(err) {
//         logger.error(err);
//     }
// }
