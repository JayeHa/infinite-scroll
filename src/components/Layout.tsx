import { PropsWithChildren } from "react";
import { Header } from "./Header";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex flex-col items-center">
      <Header />
      <div className="layout-inner mt-24 pt-12">{children}</div>
    </main>
  );
};
