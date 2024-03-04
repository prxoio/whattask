const MessagingResponse = require("twilio").twiml.MessagingResponse;

import Twilio from "twilio";
import getResponse from "./openai";
import saveDataToUserTasks from "./firestore";

export async function POST(request: Request) {
  const twiml = new MessagingResponse();

  // Access the message body from the request body
  const incomingMessageBody = await request.text();

  // Parse the incoming message body into key-value pairs
  const params = new URLSearchParams(incomingMessageBody);

  // Extract the 'Body' variable
  const messageBody = params.get("Body");
  const messageFrom = params.get("From");
  const phone = messageFrom as string;
  // Initialize the response message
  let responseMessage = "hello";
  // Check if the body is a 6-character alphanumeric string with no spaces
  if (messageBody !== null && /^[A-Za-z0-9]{6}$/.test(messageBody)) {
    responseMessage = "Code Verified";
  } else {
  //  responseMessage = "Task Created Successfully";
    const openai = await getResponse(messageBody as string);
    console.log(openai);

    const taskObject = await saveDataToUserTasks(phone, openai);
    responseMessage = `Task ${taskObject} was created successfully`;

  }

  // Log the message body and response to the console
  console.log(`Received message from: ${messageFrom}`);
  console.log(`Received message body: ${messageBody}`);
  console.log(`Response: ${responseMessage}`);

  twiml.message(responseMessage);
  return new Response(twiml.toString(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
