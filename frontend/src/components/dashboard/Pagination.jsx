import React from 'react';
import Button from '../common/Button';
import '../../styles/dashboard.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalCount, 
  pageSize, 
  onPageChange, 
  onPageSizeChange,
  isLoading 
}) => {
  if (totalPages <= 1 && totalCount === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span className="pagination-text">
          Showing {startItem}-{endItem} of {totalCount} tasks
        </span>
        <div className="page-size-selector">
          <label htmlFor="page-size" className="page-size-label">
            Tasks per page:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            disabled={isLoading}
            className="page-size-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="pagination-controls">
        <Button
          variant="secondary"
          size="small"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          className="pagination-btn"
        >
          « First
        </Button>

        <Button
          variant="secondary"
          size="small"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="pagination-btn"
        >
          ‹ Previous
        </Button>

        <div className="page-numbers">
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              className={`page-number ${pageNum === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
              disabled={isLoading}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <Button
          variant="secondary"
          size="small"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="pagination-btn"
        >
          Next ›
        </Button>

        <Button
          variant="secondary"
          size="small"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className="pagination-btn"
        >
          Last »
        </Button>
      </div>
    </div>
  );
};

export default Pagination;