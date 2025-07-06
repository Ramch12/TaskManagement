import React from "react";
import ReactPaginate from "react-paginate";

interface PaginationComponentProps {
  pageCount: number;
  currentPage: number;
  handlePageChange: (event: { selected: number }) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ 
  pageCount, 
  currentPage, 
  handlePageChange 
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={handlePageChange}
        containerClassName="pagination-container"
        previousLinkClassName="previosLinkClassName"
        nextLinkClassName="nextLinkClassName"
        activeClassName="activeClassName"
        disabledClassName="PaginationDishabled"
        forcePage={currentPage}
        breakLabel="..."
        nextLabel="Next"
        previousLabel="Previous"
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
      />
    </div>
  );
};

export default PaginationComponent; 