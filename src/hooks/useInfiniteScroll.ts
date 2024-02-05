import { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { PaginationParams, PaginationResponse } from "../types/server";
import { throttleByAnimationFrame } from "../utils/throttle";

interface InfiniteScrollOptions {
  size: number;
  offset?: number;
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
}

export const useInfiniteScroll = <T>(
  fetcher: (
    params: PaginationParams
  ) => Promise<AxiosResponse<PaginationResponse<T>>>,
  { size, onSuccess, onError, offset = 10 }: InfiniteScrollOptions
) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<T[]>([]);
  const [isFetching, setFetching] = useState(false);
  const [hasNextPage, setNextPage] = useState(true);

  const executeFetch = useCallback(async () => {
    try {
      const {
        data: { contents, pageNumber, isLastPage },
      } = await fetcher({ page, size });
      setData((prev) => prev.concat(contents));
      setPage(pageNumber + 1);
      setNextPage(!isLastPage);
      setFetching(false);
      onSuccess?.();
    } catch (err) {
      onError?.(err);
    }
  }, [page]);

  useEffect(() => {
    const handleScroll = throttleByAnimationFrame(() => {
      const { scrollTop, offsetHeight } = document.documentElement;
      if (window.innerHeight + scrollTop + offset >= offsetHeight) {
        setFetching(true);
      }
    });

    setFetching(true);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isFetching && hasNextPage) executeFetch();
    else if (!hasNextPage) setFetching(false);
  }, [isFetching]);

  return { page, data, isFetching, hasNextPage };
};
