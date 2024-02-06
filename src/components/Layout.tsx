import { PropsWithChildren } from "react";
import { Header } from "./Header";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-[100vh] flex-col items-center">
      <Header />
      <main className="mt-24 h-full w-full flex-auto">{children}</main>
    </div>
  );
};
