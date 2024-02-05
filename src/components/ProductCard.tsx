import { useViewportVisibility } from "../hooks/useViewportVisibility";
import { Product } from "../model/product";

type Props = {
  product: Product;
};

export const ProductCard = ({
  product: { id, title, image, price, brand }
}: Props) => {
  const { ref, visible } = useViewportVisibility();

  return (
    <article className="flex h-[352px] flex-col gap-2" ref={ref} data-id={id}>
      {visible && (
        <>
          <div className="relative overflow-hidden rounded-md pb-[100%]">
            <img className="absolute h-full w-full" src={image} alt="" />
          </div>

          <div>
            <span className="text-sm text-gray-500">{brand}</span>
            <h2 className="text-lg">{title}</h2>
            <span className="text-xl font-bold">₩{price}</span>
          </div>
        </>
      )}
    </article>
  );
};
