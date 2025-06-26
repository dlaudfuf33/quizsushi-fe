import { ReactNode } from "react";
import AdfitPcTall from "@/components/ad/AdfitPcTall";

export default function CreateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-w-screen min-h-screen">
        <section>{children}</section>
        <section>
          <div
            className="hidden lg:block"
            style={{
              position: "fixed",
              top: "120px",
              right: "32px",
              width: "160px",
              height: "600px",
              zIndex: 50,
            }}
          >
            <AdfitPcTall />
          </div>
        </section>
      </div>
    </>
  );
}
