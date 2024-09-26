"use client";
import Link from "next/link";
import "../products.css";
import { useState, useEffect } from "react";
import PaginationControls from "../components/pagination";
import Navbar from "../components/navbar";


/**
 * ProductsPage component that displays a list of products and handles pagination.
 */
export default function ProductsPage() {
  

/** 
 * @type {[Array, Function]} products - The list of products to be displayed. 
 */
  const [products, setProducts] = useState([]);

/** 
 * @type {[Array, Function]} filteredProducts - The filtered list of products based on the search query. 
 */
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  
  /** 
   * @type {[number, Function]} page - The current page number for pagination. 
   */
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  
  /** 
   * @constant {number} productsPerPage - The number of products displayed per page.
   */
  const productsPerPage = 20;

  const fetchProducts = async () => {
    setLoading(true);
    const skip = (page - 1) * productsPerPage;

    const queryParams = new URLSearchParams({
      limit: productsPerPage.toString(),
      skip: skip.toString(),
    });

    if (searchTerm) queryParams.append("q", searchTerm);
    if (selectedCategory) queryParams.append("category", selectedCategory);
    if (sortOrder) queryParams.append("sort", sortOrder);

    const queryString = queryParams.toString();
    const res = await fetch(`https://next-ecommerce-api.vercel.app/products?${queryString}`);
    const newProducts = await res.json();
    
    setProducts(newProducts);
    setFilteredProducts(newProducts);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, selectedCategory, sortOrder]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`https://next-ecommerce-api.vercel.app/categories`);
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleSort = (order) => {
    setSortOrder(order);
    setPage(1);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    setPage(1);
    if (query) {
      const lowerCaseSearchTerm = query.toLowerCase();
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  /**
   * Go to the next page of products.
   * 
   * @function nextPage
   */
  const nextPage = () => {
    if (page < Math.ceil(filteredProducts.length / productsPerPage)) {
      setPage((prev) => prev + 1);
    }
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
    <div className="product-ui">
      <Navbar onSearch={handleSearch} />

      <div className="filters">
        <select
          value={sortOrder}
          onChange={(e) => handleSort(e.target.value)}
          className="sort-dropdown"
        >
          <option value="">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="category-dropdown"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        {suggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {suggestions.map((product) => (
              <li key={product.id}>
                <Link href={`/${product.id}`}>
                  {product.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading ? (<p className="loading">Loading...</p>) : (
        <>
          <ul className="product-list">
            {filteredProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              filteredProducts.slice((page - 1) * productsPerPage, page * productsPerPage).map((product) => (
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
              ))
            )}
          </ul>

          <PaginationControls
            page={page}
            prevPage={prevPage}
            nextPage={nextPage}
            products={filteredProducts}
            productsPerPage={productsPerPage}
          />
        </>
      )}
    </div>
  );
}


