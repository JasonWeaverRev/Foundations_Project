## Overall Baseline Functions to Incorporate for MVP

# Employee
1. Employee Login Request and Response
2. Employee Reimbursement Request
3. View Updated Status
4. View Past Tickets

# Finance Manager (FM)
1. FM Login Request and Response
2. FM View All Employee Reimbursement Requests for All Employees
3. Filter Requests by Status**
4. Ensure Reimbursement Request Meets Company Parameters
5. Approve/Deny Reimbursement as an FM Response


# **Reimbursement Status
1. Pending
2. Approved 
3. Denied

## Structures Required
A way to store user information
    Employee vs. FM
    Login credentials (username and password)
    IF user is Employee: track user ticket submission history (details of submission)
        Submission details: ?Time submitted?, description, amount, index, status
Most likely within a separate user database
             

A way to store ticket request histories
    Global ticket database
        IF user = FM: access to tickets
            TWO Ways
                ALL tickets
                By ticket status
                **1 data structure persisting all tickets, use methods to filter, but not persist status callbacks

Tickets
    Pending -> Approved/Denied (can NEVER change after processing)

## Objects
    User Fields: [employee_status, username, password, ?login_status?]
        Default: employee, "", "", false

    Ticket Object Fields: [status, amount, description, ?time_submitted?, employee.username]
        Default: pending, 0, "", "", ""

## Method Outlines
# HTTP Request Handling
Employees:
    *GET username/tickets => View Past Tickets
        read from global ticket DB, filter by username
    POST username/tickets => Submit Reimbursement Ticket
        body contains amount, description. Submission time is logged and added into ticket object. ticket is then added to global ticket DB

    # At MVP, no need to use DELETE or PUT requests. No tickets or history to delete, and nothing should be edited by the employee

FM:
    *GET username/tickets => View ALL past tickets
        read from global ticket DB, no filters for baseline functionality
    GET username/tickets/{status} => View SPECIFIC tickets by status
        read from global ticket DB, then filter by {status}
    PUT username/tickets =>
        read from global ticket DB, then filter to pending, then dequeue. After dequeue, set ticket status. Afterwards, add the ticket back to the queue
    
    # At MVP, no need to use DELETE or POST requests. No new tickets to add to the DB, and tickets should not be deleted. Ticket status is reflected to the employee the next time the employee would submit a GET request

* Since we have two identical HTTP requests to the same URL, the method retrieving the tickets should determine the action based on the employee.employee_status
** IF Username is invalid OR Username.login_status is FALSE, return HTTP status code: 401

# Item Methods
User:
    Register new login (username, password) =>
        Add employee to the user DB with username, password
        Username must be unique in user DB, both parameters must not be empty
        Password does not have to be unique
    
    Login to tickets DB (username, password) =>
        IF username and password have a matching pair in user DB, set login status to TRUE

    View employee ticket history (username) =>
        Search for the employee in the user DB to make sure employee is valid
        If valid, check for the employee status
            IF employee:
                read from global ticket DB, filter tickets by tickets.employee.username
                return array of tickets
            IF FM:
                read from global ticket DB
                return array of tickets

    View employee ticket history by status (username, status) =>
        Search for the employee in the user DB to make sure employee is valid
        If valid, check for the employee status
            IF FM:
                read from global ticket DB, filter by {status}
                return array of tickets

    Submit new ticket (username, amount, description) =>
        Search for the employee in the user DB to make sure employee is valid
        If valid, check for the employee status
            IF FM:
                create new ticket object with given parameters
                push ticket into global ticket DB

**Possibly more efficient to create separate username reading function or check outside of service class        



Tickets:
    Set pending status(status) =>
        Set ticket.status to either "approved" or "denied"
            All other statuses return the ticket without changing the status from pending
        Since tickets are received by a queue system, there should not be a need for a ticket id system in place




