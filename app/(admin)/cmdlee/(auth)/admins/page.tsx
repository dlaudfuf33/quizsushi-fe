import AdminsClientPage from "./clientPage";
import { redirect } from "next/navigation";
import { AdminAPI } from "@/lib/api/admin.api";
import { getCookieSession } from "@/lib/serverUtils";

export default async function Page() {
  const session = await getCookieSession();
  if (!session) {
    redirect("/cmdlee/login");
  }

  try {
    const res = await AdminAPI.getSession(`JSESSIONID=${session?.value}`);
    console.log("res ", res);
    if (!res) {
      redirect("/cmdlee/login");
    }
    return (
      <div>
        <AdminsClientPage />
      </div>
    );
  } catch (err) {
    console.log(err);
    redirect("/cmdlee/login");
  }
}
