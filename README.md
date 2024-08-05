```markdown
# WhatTask

Welcome to **WhatTask**! WhatTask is a web application and WhatsApp bot designed to make task management accessible and convenient. Users can simply send a message to the WhatTask bot on WhatsApp to set reminders and manage tasks effortlessly. This README provides an overview of the technical journey, architecture, challenges faced, and successes achieved in developing WhatTask.

## Concept

WhatTask aims to simplify task management by allowing users to interact with a WhatsApp bot. For instance, sending a message like "remind me to clean my car tomorrow" to the WhatTask bot sets a reminder for the user. The core functionality relies on the integration of the GPT-4 API, which interprets the user's message and returns structured data as JSON, which is then used to display reminders and tasks.

## Architectural Overview

The architecture of WhatTask is structured around three main components:

1. **WhatsApp Bot Interface**: The entry point for users.
2. **Backend Processing with GPT-4**: Interprets user messages.
3. **Task Management Interface**: Built with Next.js and Firestore.

### WhatsApp Bot Interface

The WhatsApp bot interface uses the WhatsApp Business API (via Twilio) to receive messages from users and send responses. When a user sends a message, the bot forwards the message to the backend for processing.

#### Simplified Twilio API Route (Next.js)

```javascript
const MessagingResponse = require("twilio").twiml.MessagingResponse;
export async function POST(request: Request) {
  const twiml = new MessagingResponse();
  const incomingMessageBody = await request.text();
  const params = new URLSearchParams(incomingMessageBody);
  const messageBody = params.get("Body");
  const messageFrom = params.get("From");
  const phone = messageFrom as string;
 
  responseMessage = "Task Created Successfully";
  const openai = await getResponse(messageBody as string);
  const taskObject = await saveDataToUserTasks(phone, openai);
  responseMessage = `Task ${taskObject} was created successfully`;
}
```

### Backend Processing with GPT-4

Upon receiving a task reminder, the backend uses the OpenAI GPT-4 API to interpret the user's message. The API can understand natural language and parse various task descriptions, returning a JSON array with structured information about the task.

#### Simplified GPT-4 API Interaction

```javascript
export default async function getResponse(message: string) {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: process.env.ASST_ID as string,
      thread: {
        messages: [
          {
            role: "user",
            content: message + " - context: the current date/time is " + getCurrentDateTime(),
          },
        ],
      },
    });
    const thread_id = run.thread_id;
    const threadMessages = await openai.beta.threads.messages.list(thread_id);
    return threadMessages.data[0].content;
  }
}
```

Example JSON array returned by the API:

```json
[
  {
    "taskName": "Book flight to Bangkok",
    "taskDescription": "Arrange for a flight booking to BKK next Monday.",
    "priority": "High",
    "category": "Personal",
    "dueDate": "2024-03-05T16:31:00.000Z",
    "tags": ["travel", "flight", "booking", "Bangkok"]
  }
]
```

### Task Management with Next.js and Firestore

The JSON object returned by the GPT-4 API is parsed by another endpoint, which acts as the heart of the application's logic. The task information is then stored in Firestore, allowing users to efficiently manage tasks, including adding, editing, and removing them.

#### Simplified Code for Saving Data to Firestore

```javascript
data.forEach(async (item) => {
  const parsedItem = JSON.parse(item?.text?.value)[0];
  const taskData = {
    name: parsedItem.name || parsedItem.title,
    description: parsedItem.description,
    priority: parsedItem.priority,
    category: parsedItem.category,
    tags: parsedItem.tags,
    dueDate: parsedItem.dueDate,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    taskId: taskId,
    status: "open",
  };
  taskName = taskData.name;
  const taskRef = doc(db, `users/${user.uid}/tasks/${taskId}`);
  await setDoc(taskRef, taskData);
});
```
