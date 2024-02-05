import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { User } from "./components/user";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <User />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
