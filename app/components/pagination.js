export default function PaginationControls({ page, prevPage, nextPage, products, productsPerPage }){
    return (

       <div>
            <button onClick={prevPage} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={nextPage} disabled={products.length < productsPerPage}>
              Next
            </button>
        </div>
    )};