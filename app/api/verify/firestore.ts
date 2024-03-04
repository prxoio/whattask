import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

import { app } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";

const db = getFirestore(app);

// TypeScript interface for User
interface User {
  uid: string;
  phoneNumber: string;
}

// Function to save data to user's tasks
export default async function saveDataToUserTasks(
  phoneNumber: string,
  data: any[],
): Promise<string> {
  const taskId = generateRandomString(5);
  let taskName = "";

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phone", "==", phoneNumber));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching user found.");
      return "No matching user found.";
    }

    // Assuming the phone number is unique and only one user should match
    const user = querySnapshot.docs[0].data() as User;

    data.forEach(async (item) => {
      const parsedItem = JSON.parse(item?.text?.value)[0];
      if (!parsedItem) {
        return;
      }
      const taskData = {
        name: parsedItem.name || parsedItem.title,
        description: parsedItem.description,
        priority: parsedItem.priority,
        category: parsedItem.category,
        tags: parsedItem.tags,
        dueDate: parsedItem.dueDate || parsedItem.due_date,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        taskId: taskId,
        status: "open",
      };
      taskName = taskData.name;

      // Path to user's tasks
      const taskRef = doc(db, `users/${user.uid}/tasks/${taskId}`);

      // Saving the data
      await setDoc(taskRef, taskData);
    });

    console.log(`Data saved to tasks of user ${user.uid}.`);
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
  } finally {
    return `${taskName} (${taskId})`;
  }
}

const generateRandomString = function (length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  result = "WT-" + result;
  return result;
};
