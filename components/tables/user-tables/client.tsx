"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/task-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/constants/data";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { auth, firestore } from "@/lib/firebase";
import { useEffect, useState } from "react";
import {
  DocumentData,
  Timestamp,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";



interface ProductsClientProps {
  data: number;
}

export const UserClient = ({ data }: ProductsClientProps) => {
  const router = useRouter();
  const [taskData, setTaskData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
  
    if (auth.currentUser) {
      const user = auth.currentUser.uid;
      const ref = collection(firestore, "users", user, "tasks");
  
      const unsubscribe = onSnapshot(ref, (querySnapshot) => {
        const newdata: Task[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Task;
          if (data.updatedAt) {
            const date = new Date(
              (data.updatedAt as unknown as Timestamp).seconds * 1000,
            );
            data.updatedAt = new Date(
              (data.updatedAt as unknown as Timestamp).seconds * 1000,
            )
              .toLocaleString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
              .replace(",", " -");
          }
          newdata.push(data);
        });
        setTaskData(newdata);
      }, (error) => {
        console.log("Error getting documents: ", error);
      });
  
      // Cleanup function to unsubscribe from the listener when the component unmounts
      return () => unsubscribe();
    }
  }, []);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Tasks (${taskData.length})`}
          description="Manage users (Client side table functionalities.)"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/tasks/new`)}
          disabled={loading}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={taskData} />
    </>
  );
};
