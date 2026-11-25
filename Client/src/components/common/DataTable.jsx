import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';

export const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  pagination,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="bg-[#0c222a] border border-[#143542] rounded-2xl p-12">
        <LoadingSpinner label="Fetching data..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#0c222a] border border-[#143542] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#143542]/50 flex items-center justify-center text-[#0AE3DA] mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-[#E5E7E7]">{emptyMessage}</p>
        <p className="text-xs text-[#E5E7E7]/50 mt-1">There are currently no items matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0c222a] border border-[#143542] rounded-2xl overflow-hidden shadow-lg flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#143542] bg-[#06161B]/60 text-[11px] uppercase tracking-wider text-[#0AE3DA] font-semibold">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#143542]/50 text-sm">
            {data.map((row, rowIdx) => (
              <tr
                key={row._id || rowIdx}
                className="hover:bg-[#143542]/30 transition-colors duration-150 text-[#E5E7E7]/90"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`px-6 py-4 align-middle ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-3 border-t border-[#143542] bg-[#06161B]/40 flex items-center justify-between text-xs text-[#E5E7E7]/60">
          <span>
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage <= 1}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              icon={ChevronLeft}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              icon={ChevronRight}
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

