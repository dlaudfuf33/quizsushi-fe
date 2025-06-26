import { getCookieSession } from "@/lib/serverUtils";
import { redirect } from "next/navigation";
import { AdminAPI } from "@/lib/api/admin.api";
import ReportsClientPage from "./clientPage";

export default async function Page() {
  const session = await getCookieSession();
  if (!session) {
    redirect("/cmdlee/login");
  }

  try {
    const res = await AdminAPI.getSession(`JSESSIONID=${session?.value}`);
    console.log(res);
    if (!res) {
      redirect("/cmdlee/login");
    }
    return (
      <div>
        <ReportsClientPage />
      </div>
    );
  } catch (err) {
    console.log(err);
    redirect("/cmdlee/login");
  }
}
