import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function getResponse(message: string) {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: process.env.ASST_ID as string,
      thread: {
        messages: [
          {
            role: "user",
            content:
              message +
              "- context: the current date/time is " +
              getCurrentDateTime(),
          },
        ],
      },
    });

    const thread_id = run.thread_id;

    // wait for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 8000));

    const threadMessages = await openai.beta.threads.messages.list(thread_id);

    // Check if threadMessages is empty
    if (threadMessages.data.length === 0) {
      // Retry after 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const retryThreadMessages =
        await openai.beta.threads.messages.list(thread_id);
      return retryThreadMessages.data[0].content;
    }

    console.log(threadMessages.data[0].content);

    console.log(run);

    return threadMessages.data[0].content;
  } catch (error) {
    // Handle error here
    console.error("Error:", error);
    throw error;
  }
}

function getCurrentDateTime(): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const now = new Date();

  const dayOfWeek = days[now.getDay()];
  const dayOfMonth = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}, ${dayOfWeek} ${dayOfMonth} ${month} ${year}`;
}
