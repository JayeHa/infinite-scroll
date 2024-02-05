import { useMemo } from "react";
import { useIntersect } from "../hooks/useIntersect";
import { useFetchUsers } from "../hooks/users";

const PAGE_SIZE = 10;

export const User = () => {
  const { data, hasNextPage, isFetching, fetchNextPage } = useFetchUsers({
    size: PAGE_SIZE,
  });
  const users = useMemo(
    () => (data ? data.pages.flatMap(({ data }) => data.contents) : []),
    [data]
  );

  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  });

  return (
    <div>
      {users.map((user) => (
        <div key={user.id} style={{ height: "10vh" }}>
          {user.name}
        </div>
      ))}
      {isFetching && <div>loading...🕐</div>}
      <div ref={ref} />
    </div>
  );
};
