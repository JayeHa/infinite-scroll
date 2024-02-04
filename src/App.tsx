import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { User } from "./model/user";
import { PaginationResponse } from "./types/server";

const PAGE_SIZE = 10;

export function App() {
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isFetching, setFetching] = useState(false);
  const [hasNextPage, setNextPage] = useState(true);

  const fetchUsers = useCallback(async () => {
    const { data } = await axios.get<PaginationResponse<User>>("/users", {
      params: { page, size: PAGE_SIZE },
    });

    setUsers(users.concat(data.contents));
    setPage(data.pageNumber + 1);
    setNextPage(!data.isLastPage);
    setFetching(false);
  }, [page, users]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, offsetHeight } = document.documentElement;
      if (window.innerHeight + scrollTop >= offsetHeight) {
        setFetching(true);
      }
    };
    setFetching(true);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isFetching && hasNextPage) fetchUsers();
    else if (!hasNextPage) setFetching(false);
  }, [fetchUsers, hasNextPage, isFetching]);

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
