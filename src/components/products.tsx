import { useMemo } from "react";
import { useFetchProducts } from "../hooks/products";
import { useIntersect } from "../hooks/useIntersect";
import { ProductCard } from "./ProductCard";

export const Products = () => {
  const { data, hasNextPage, isFetching, fetchNextPage } = useFetchProducts({
    size: 10,
  });

  const products = useMemo(
    () => (data ? data.pages.flatMap(({ data }) => data.contents) : []),
    [data],
  );

  const ref = useIntersect(
    async (entry, observer) => {
      observer.unobserve(entry.target);
      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    { rootMargin: "120%" },
  );

  return (
    <div className="grid grid-cols-4 gap-x-4 gap-y-16">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {isFetching && <div>loading...🕐</div>}
      <div ref={ref} />
    </div>
  );
};
