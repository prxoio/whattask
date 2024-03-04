import BreadCrumb from "@/components/breadcrumb";
import { TaskForm } from "@/components/forms/task-form";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Tasks", link: "/dashboard/tasks" },
    { title: "Create", link: "/dashboard/task/create" },
  ];
  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <TaskForm
        categories={[
          { _id: "urgent", name: "Urgent" },
          { _id: "normal", name: "Normal" },
          { _id: "low", name: "Low" },
        ]}
        initialData={null}
        key={null}
      />
    </div>
  );
}
