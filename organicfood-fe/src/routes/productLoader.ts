import type { LoaderFunctionArgs } from "react-router-dom";
import { getProductBySlug, getProducts } from "../services/productService";

export async function productLoader({ params }: LoaderFunctionArgs) {
  const productSlug = params.slug ?? "";

  const product = getProductBySlug(productSlug);

  return product;
}
