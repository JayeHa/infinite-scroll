import axios from "axios";
import { QueryFunctionContext, useInfiniteQuery } from "react-query";
import { User } from "../model/user";
import { PaginationParams, PaginationResponse } from "../types/server";

const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

export const useFetchUsers = ({ size }: PaginationParams) =>
  useInfiniteQuery(
    userKeys.lists(),
    ({ pageParam = 0 }: QueryFunctionContext) =>
      axios.get<PaginationResponse<User>>("/users", {
        params: { page: pageParam, size },
      }),
    {
      getNextPageParam: ({ data: { isLastPage, pageNumber } }) =>
        isLastPage ? undefined : pageNumber + 1,
    }
  );
