"use client";
import Link from "next/link";
import "../products.css";
import { useState, useEffect } from "react";
import PaginationControls from "../components/pagination";

/**
 * ProductsPage component that displays a list of products and handles pagination.
 */

export default function ProductsPage() {
   /** @type {[Array, Function]} products - The list of products to be displayed. */
  const [products, setProducts] = useState([]);
    /** @type {[number, Function]} page - The current page number for pagination. */
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
    /** @constant {number} productsPerPage - The number of products displayed per page. */
  const productsPerPage = 20;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const skip = (page - 1) * productsPerPage;
      const res = await fetch(
        `https://next-ecommerce-api.vercel.app/products?limit=${productsPerPage}&skip=${skip}`
      );
      const newProducts = await res.json();
      setProducts(newProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [page]);

  /**
   * Go to the next page of products.
   * 
   * @function nextPage
   */

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  /**
   * Go to the previous page of products.
   * 
   * @function prevPage
   */

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      {loading ? (
        <p className="loading"></p>
      ) : (
        <>
          <ul className="product-list">
            {products.map((product) => (
              <li key={product.id} className="product-card">
                <Link href={`/${product.id}`} className="link">
                  
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="product-image"
                    />
                    <h2 className="product-title">{product.title}</h2>
                    <p className="product-category">Category: {product.category}</p>
                    <p className="product-brand">Brand: {product.brand}</p>
                    <p className="product-price">Price: ${product.price}</p>
                    <p className="product-tags">Tags: {product.tags.join(", ")}</p>
                  
                </Link>
              </li>
            ))}
          </ul>

          <PaginationControls
            page={page}
            prevPage={prevPage}
            nextPage={nextPage}
            products={products}
            productsPerPage={productsPerPage}
          />
        </>
      )}
    </div>
  );
}
