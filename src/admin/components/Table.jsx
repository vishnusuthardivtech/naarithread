import React from 'react'

const Table = ({ 
  columns, 
  data, 
  loading = false,
  emptyText = 'No data available',
  className = '',
  onRowClick,
  ...props 
}) => {
  return (
    <div className={`admin-table bg-bg-card border border-border rounded-xl ${className}`} {...props}>
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="font-semibold text-text-secondary text-xs uppercase tracking-wider">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-text-secondary">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-text-secondary">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex}
                className="hover:bg-bg-hover border-t border-border transition-colors cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="font-medium text-text-primary">
                    {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table

