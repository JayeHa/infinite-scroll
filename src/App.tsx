import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Products } from "./components/products";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Products />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
