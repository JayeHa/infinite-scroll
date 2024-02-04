import { HttpResponse, delay, http } from "msw";
import { User } from "../model/user";
import { PaginationResponse } from "../types/server";

const users = Array.from(Array(1024).keys()).map(
  (id): User => ({
    id,
    name: `denis${id}`,
  })
);

export const handlers = [
  http.get("/users", async ({ request }) => {
    const url = new URL(request.url);
    const size = Number(url.searchParams.get("size"));
    const page = Number(url.searchParams.get("page"));
    const totalCount = users.length;
    const totalPages = Math.round(totalCount / size);

    await delay(500);

    return HttpResponse.json<PaginationResponse<User>>(
      {
        contents: users.slice(page * size, (page + 1) * size),
        pageNumber: page,
        pageSize: size,
        totalPages,
        totalCount,
        isLastPage: totalPages <= page,
        isFirstPage: page === 0,
      },
      { status: 200 }
    );
  }),
];
