import { MemberAPI } from "@/lib/api/member.api";
import { getCookieHeader } from "@/lib/serverUtils";
import { MyPageClient } from "./clientPage";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookie = await getCookieHeader();
  let profileRes;

  try {
    [profileRes] = await Promise.all([MemberAPI.getUserProfile(cookie)]);
  } catch (e) {
    redirect("/");
  }

  return <MyPageClient userData={profileRes} />;
}
