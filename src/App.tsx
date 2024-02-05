import { fetchUsers } from "./apis/users";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";

const PAGE_SIZE = 10;

export function App() {
  const { data: users, isFetching } = useInfiniteScroll(fetchUsers, {
    size: PAGE_SIZE,
  });

  return (
    <div className="App">
      {users.map((user) => (
        <div key={user.id} style={{ height: "10vh" }}>
          {user.name}
        </div>
      ))}
      {isFetching && <div>loading...🕐</div>}
    </div>
  );
}
