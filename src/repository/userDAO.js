/**
 * Representation of the User Repository access
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
TableName = "Users";

// POST COMMANDS

/**
 * Post new user. User validation and input is performed in the UserService class
 **/
async function postUser(Item) {
    // Create put command to the User Table adding in the user
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

// GET COMMANDS

/**
 * Retrieve a list of all the users in the table
 */
async function getAllUsers() {
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
 * Retrieve a user by its username
 */
async function getUser(username) {

    const command = new ScanCommand({
        TableName,
        FilterExpression: "#Username = :Username",
        ExpressionAttributeNames: {"#Username": "Username"},
        ExpressionAttributeValues: {":Username": username}
    });
    try {
        const data = await documentClient.send(command);
        return data.Items[0];
    } catch(err) {
        console.log("NOT FOUND IN DAO")
        logger.error(err);
    }
}


module.exports = {
    postUser,
    getAllUsers,
    getUser
}