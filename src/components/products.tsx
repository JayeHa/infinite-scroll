import { useMemo } from "react";
import { useFetchProducts } from "../hooks/products";
import { useIntersect } from "../hooks/useIntersect";

export const Products = () => {
  const { data, hasNextPage, isFetching, fetchNextPage } = useFetchProducts({
    size: 10,
  });

  const products = useMemo(
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
      {products.map((product) => (
        <div key={product.id}>
          {product.title}
          <img src={product.image} />
        </div>
      ))}
      {isFetching && <div>loading...🕐</div>}
      <div ref={ref} />
    </div>
  );
};
