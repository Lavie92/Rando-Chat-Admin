import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  loading: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
  label?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  loading,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onRefresh,
  label = "",
}: PaginationProps) {
  const handlePrev = useCallback(() => {
    if (hasPrevPage) onPageChange(currentPage - 1);
  }, [currentPage, hasPrevPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (hasNextPage) onPageChange(currentPage + 1);
  }, [currentPage, hasNextPage, onPageChange]);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-2 mt-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={!hasPrevPage || loading}
          className="px-3 py-1 bg-gray-100 text-sm rounded disabled:opacity-50 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          ← Trước
        </button>

        <div className="flex gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={loading}
              className={`px-3 py-1 text-sm rounded disabled:opacity-50 ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!hasNextPage || loading}
          className="px-3 py-1 bg-gray-100 text-sm rounded disabled:opacity-50 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Tiếp →
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {currentPage} / {totalPages} ({totalCount} {label})
        </span>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded disabled:opacity-50 hover:bg-green-200"
          >
            🔄 Làm mới
          </button>
        )}
      </div>
    </div>
  );
}
