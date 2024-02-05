import { Product } from "../model/product";

type Props = {
  product: Product;
};

export const ProductCard = ({
  product: { title, image, price, brand },
}: Props) => {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative overflow-hidden rounded-md pb-[100%]">
        <img className="absolute h-full w-full" src={image} alt="" />
      </div>

      <div>
        <span className="text-sm text-gray-500">{brand}</span>
        <h2 className="text-lg">{title}</h2>
        <span className="text-xl font-bold">₩{price}</span>
      </div>
    </article>
  );
};
