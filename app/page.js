import styles from "./products.css";
import ProductsPage from "./products/productsPage";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar/>
      <ProductsPage/>
    </div>
  );
}
