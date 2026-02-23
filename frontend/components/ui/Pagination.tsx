"use client";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  loading,
  onPageChange,
  onLimitChange,
}: Props) {
  return (
    <div style={{ marginBottom: 12 }}>
      <button
        disabled={page <= 1 || loading}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      <span style={{ margin: "0 10px" }}>
        Page {page} / {totalPages} (Total: {total})
      </span>

      <button
        disabled={page >= totalPages || loading}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>

      <select
        style={{ marginLeft: 12 }}
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        disabled={loading}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
    </div>
  );
}