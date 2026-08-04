import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { SiteLayout } from "@/components/site-layout";
import { localProducts } from "@/lib/products";


export const Route = createFileRoute("/products")({
  loader: () => {
    return {
      products: localProducts,
    };
  },

  head: () => ({
    meta: [
      {
        title: "محصولات | آسیا تل پرو",
      },
    ],
  }),

  component: ProductsPage,
});


function ProductsPage() {

  const { products } = Route.useLoaderData();


  return (
    <SiteLayout>

      <div className="mx-auto max-w-6xl px-4 py-8">

        <h1 className="mb-8 text-center text-3xl font-black">
          محصولات
        </h1>


        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </section>

      </div>

    </SiteLayout>
  );
}
