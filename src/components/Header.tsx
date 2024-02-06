import { sizeConfig } from "../styles/constants";

export const Header = () => {
  return (
    <header className="fixed top-0 z-10 w-full border-b bg-white shadow-sm">
      <div className="flex h-24 flex-col items-center justify-center">
        <div className={`w-full px-4 ${sizeConfig.AppMaxWidth}`}>
          <h1 className="text-4xl font-bold">내일의집</h1>
        </div>
      </div>
    </header>
  );
};
