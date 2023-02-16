# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

## Ticket 1: Allow Facilities to save custom ids for Agents (should handle DB table creation in qa, staging and prod)

### Acceptance Criteria:

- Facilities can save a custom id for each Agent they work with 
- Custom ids must be unique to each Facility 
- Custom ids must be viewable and editable by the facility owner/admin/some form of UI/dashboard

### Effort Estimate: 3 story points

### Implementation Details:

- Add a new Table custom_agent_ids (agent_id (PK, FK to agent table), custom_id, facility_id). // custom_id+facility_id is unique and we should add a constraint for the same on db level. Table will have createdAt, updatedAt, isDeleted columns too
- When an Agent is added to a Facility, create a new row in 'custom_agent_ids' with the custom id provided by the Facility 
- When generating a report for a Facility, use the custom id from 'facility_agent_ids' instead of the internal database id
- If the facility has not provided the custom_id, we should not create a row and rely on database provided agent_id 

## Ticket 2: Validate uniqueness of custom ids

### Acceptance Criteria:

Facilities cannot save a custom id that already exists for another Agent within their own Facility

Error messages are shown to the Facility user when they attempt to save a non-unique custom id

### Effort Estimate: 1 story point

### Implementation Details:

- create error codes as constants (like enums)
- Add catch block to handle unique constraint error thrown by db, and return human readable error message along with error code 


## Ticket 3: Add BE APIs to edit/delete/get custom ids 

### Acceptance Criteria:

-- (These can be tested on POSTMAN)
- Facilities can perform CRUD operations on custom ids for Agents they work with 
- Custom ids must remain unique to each Facility 
- Custom ids must be viewable, editable and removed from the Facility dashboard
- Once deleted can't be undeleted.

### Effort Estimate: 5 story points

### Implementation Details:

- add api call(s) to perform CRUD functions
- Edit should allow us to change the custom_id ONLY
- Facility owner/admin can remove a record, and it should be mark isDeleted = true in table (custom_agent_ids)

## Ticket 4: Integrate backend API in FE

(the UI should allow us to perform the below actions)
- Facilities can perform CRUD operations on custom ids for Agents they work with
- Custom ids must remain unique to each Facility
- Custom ids must be viewable, editable and removed from the Facility dashboard

### Effort Estimate: 5 story points

### Implementation Details:

-- Assuming we are using one of the modern frameworks like Angular, React
- Add an 'Edit' button to the custom id column in the Facility dashboard's Agents table 
- When the 'Edit' button is clicked, show a modal with a form to edit the custom id 
- When the form is submitted, send the request to the BE API.

- Add a 'Delete'' button to the custom id column in the Facility dashboard's Agents table
- When the 'Delete' button is clicked, show a modal to confirm the action
- When the action is confirmed, send the request to the BE API

## Ticket 5: Add custom id column to generated reports

### Acceptance Criteria:

- The generated reports show the custom id for each Agent instead of their internal database id

### Effort Estimate: 2 story point

### Implementation Details:

- Modify the 'generateReport' function to fetch the custom id for each Agent from the 'custom_agent_ids' table instead of using the internal database id 
- If the custom id doesn't exist then use the internal database id
- Also move the new functionality under split.


## Ticket 6: Test it on staging

### Acceptance Criteria:

- It should work on staging and on prod for specific facilities before we release to 100% (use split.io)

### Effort Estimate: 2 story points

### Implementation Details:

- add split flag and test in staging the new implementation of generateReport
- once tested on staging, release on production for specific facilities.
