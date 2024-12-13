### Application Lifecycle Based on User Actions

1. **Select a Swarm**
   - User selects a swarm from the dropdown.
   - The selected swarm's ID is stored in the state.

### Review of Step 1: Select a Swarm

#### User Action and Immediate Application Actions
- **User Action**: The user selects a swarm from the dropdown.
- **Immediate Application Actions**:
  - The selected swarm's ID is stored in the application's state.

#### State Update and Resulting Actions
- **State Update**: The application state is updated to include the ID of the selected swarm.
- **Resulting Actions**: This state update does not directly trigger any other actions as described in the documentation. However, storing the swarm ID in the state is crucial for subsequent actions, such as creating a new session or starting a session, as these actions require the selected swarm's ID.

#### Passing State to Child Components
- The documentation does not explicitly mention passing the selected swarm's ID to child components in this step. However, it's common in applications for the selected state (like the selected swarm's ID) to be passed down to child components that require this information for rendering or further actions. For example, a child component might need the selected swarm's ID to display details about the selected swarm or to enable session creation for that swarm.

#### Review of Callbacks
- There are no callbacks directly associated with the action of selecting a swarm as described in the documentation. The action of selecting a swarm primarily involves updating the state with the selected swarm's ID.

### Summary
The first step in the application lifecycle based on user actions involves the user selecting a swarm from a dropdown, which results in the selected swarm's ID being stored in the application's state. This step is foundational for subsequent actions, as many of them require knowledge of the selected swarm's ID. There are no further actions, child component interactions, or callbacks explicitly mentioned in this step, suggesting its primary purpose is to capture and store the user's selection for use in later steps.

2. **Create a New Session**
   - User clicks the "Create New Session" button.
   - A temporary session ID is generated.
   - A new session object is added to the sessions array in the state.
   - The [updateSwarmSessions](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/page.tsx#145%2C9-145%2C9) function is called to update the sessions on the server.
   - The [handleStartSession](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/page.tsx#104%2C71-104%2C71) function is called with the new session's ID and selected swarm's ID.

   ### Review of Step 2: Create a New Session

#### User Action and Immediate Application Actions
- **User Action**: The user clicks the "Create New Session" button.
- **Immediate Application Actions**:
  - A temporary session ID is generated.
  - A new session object is added to the sessions array in the state.
  - The [updateSwarmSessions](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/SwarmPlaygroundLifecycle.md#31%2C11-31%2C11) function is called to update the sessions on the server.
  - The [handleStartSession](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/SwarmPlaygroundLifecycle.md#32%2C11-32%2C11) function is called with the new session's ID and selected swarm's ID.

#### State Update and Resulting Actions
- **State Update**: The application state is updated to include a new session object in the sessions array. This object contains the temporary session ID and potentially other session-related information.
- **Resulting Actions**:
  - **Server Update**: The [updateSwarmSessions](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/SwarmPlaygroundLifecycle.md#31%2C11-31%2C11) function updates the server with the new session information. This is crucial for keeping the server in sync with the client's state.
  - **Session Initialization**: The [handleStartSession](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/SwarmPlaygroundLifecycle.md#32%2C11-32%2C11) function initiates the session with the server using the new session's ID and the previously selected swarm's ID. This action is essential for starting the actual session on the server side.

#### Passing State to Child Components
- The documentation does not specify if the new session state is passed to child components. However, it's reasonable to assume that components responsible for displaying session information or interacting with the session would require access to this updated state. For example, a session list component might need to re-render to include the newly created session.

#### Review of Callbacks
- **[updateSwarmSessions](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/SwarmPlaygroundLifecycle.md#31%2C11-31%2C11) Callback**: This function likely includes a callback mechanism to handle the response from the server, such as confirming the session creation or handling errors.
- **[handleStartSession](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/SwarmPlaygroundLifecycle.md#32%2C11-32%2C11) Callback**: This function, being responsible for initiating the session, might also include callbacks for handling the success or failure of starting the session on the server.

### Summary
The second step in the application lifecycle involves the user creating a new session. This action triggers a series of immediate application actions, including generating a temporary session ID, updating the application state with a new session object, and calling functions to update the server and initiate the session. The state update is crucial for maintaining a current list of sessions in the client, and the callbacks within [updateSwarmSessions](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/SwarmPlaygroundLifecycle.md#31%2C11-31%2C11) and [handleStartSession](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/SwarmPlaygroundLifecycle.md#32%2C11-32%2C11) functions are essential for handling the outcomes of these actions. This step is significant for transitioning from selecting a swarm to actively starting a session with that swarm.

3. **Start a Session**
   - User clicks on a session button.
   - The [handleStartSession](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/page.tsx#104%2C71-104%2C71) function is called with the session's ID and swarm ID.
   - A new WebSocket connection is initiated.
   - The [prepareAndOpenDialog](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/page.tsx#57%2C9-57%2C9) function may be called if the selected swarm requires additional user input.

4. **Send a Message**
   - User types a message and either presses "Enter" or clicks the send button.
   - The message is sent through the WebSocket connection associated with the selected session.
   - The input field is cleared.

5. **Open Display Options**
   - User clicks the "Display Options" button.
   - The [DisplayMessageType](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/page.tsx#11%2C10-11%2C10) component is displayed, allowing the user to select which types of messages to display.

6. **Submit Dialog Form**
   - User fills in the required fields in the dialog and clicks "Submit".
   - The [handleDialogSubmit](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/page.tsx#97%2C7-97%2C7) function is called.
   - Placeholder values in the user request and shared instructions are replaced with user-provided values.
   - The dialog is closed, and the session's state is updated to "NEW_CONNECTION".

7. **Change Message Display Preferences**
   - User interacts with the [DisplayMessageType](file:///c%3A/Users/Bryan/Source/Repos/VAClaims/vaclaims-customer-portal/src/app/admin/swarm/page.tsx#11%2C10-11%2C10) component to select which message types to display.
   - The selected message types are stored in the state and local storage.

### Application Lifecycle Based on Server Actions via WebSocket

1. **Connected**
   - The server sends a "connected" status message.
   - The application updates the process state to "CONNECTED".
   - A "new_session" action message is sent to the server.

2. **Session Started**
   - The server sends a "session_started" status message.
   - The application updates the process state to "SESSION_STARTED".
   - An "init_agency" action message is sent to the server.

3. **Agency Initialized**
   - The server sends an "agency_initialized" status message.
   - The application updates the process state to "INITIALIZED".
   - A "run_agency" action message is sent to the server.

4. **Running**
   - The server sends a "running" status message.
   - The application updates the process state to "RUNNING".

5. **Task Completed**
   - The server sends a "task_completed" status message.
   - The application updates the process state to "COMPLETED".
   - The WebSocket connection is closed.

6. **New Task**
   - The server informs the client that a new task has started.
   - The application may update the UI to reflect the new task status.

7. **Error**
   - The server sends an error message.
   - The application logs or displays the error message.

8. **Function Message**
   - The server sends a function message.
   - The application adds the message to the messages array in the state if it matches the selected message types.

9. **Function Output Message**
   - The server sends a function output message.
   - The application adds the message to the messages array in the state if it matches the selected message types.

10. **Text Message**
    - The server sends a text message.
    - The application adds the message to the messages array in the state if it matches the selected message types.