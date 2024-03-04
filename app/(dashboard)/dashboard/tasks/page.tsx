import BreadCrumb from "@/components/breadcrumb";
import { UserClient } from "@/components/tables/user-tables/client";

const breadcrumbItems = [{ title: "Tasks", link: "/dashboard/tasks" }];
export default function page() {
const rand = Math.random()
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <UserClient data={rand} />
      </div>
    </>
  );
}
