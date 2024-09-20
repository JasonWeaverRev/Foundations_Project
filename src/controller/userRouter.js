/**
 * Controller class that will facilitate interaction between the client and user repository
 * and ticket repository
 */

const express = require("express");
const router = express.Router();

const ticketService = require("../service/ticketService");
const userService = require("../service/UserService");

