import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface DataTableProps<TData> {
  columns: { id?: string; header: string; accessorKey: string; cell?: (row: TData) => React.ReactNode }[]
  data: TData[]
  filterPlaceholder?: string
  filterKey?: string
}

function DataTable<TData>({
  columns,
  data,
  filterPlaceholder,
  filterKey,
}: DataTableProps<TData>) {
  const [sorting, _setSorting] = React.useState<string>('')
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({})

  const sortedData = React.useMemo(() => {
    if (!sorting) return data
    return [...data].sort((a: any, b: any) => {
      const aVal = a[sorting]
      const bVal = b[sorting]
      if (aVal < bVal) return -1
      if (aVal > bVal) return 1
      return 0
    })
  }, [data, sorting])

  const filteredData = React.useMemo(() => {
    if (!filterKey) return sortedData
    return sortedData.filter((row: any) =>
      String(row[filterKey]).toLowerCase().includes((filterPlaceholder || '').toLowerCase())
    )
  }, [sortedData, filterKey, filterPlaceholder])

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        {filterKey && (
          <Input
            placeholder={filterPlaceholder || `Filter...`}
            value={filterPlaceholder || ''}
            onChange={() => {}}
            className="max-w-sm"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto h-8">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.accessorKey}
                className="capitalize"
                checked={columnVisibility[column.accessorKey] ?? true}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    [column.accessorKey]: !!value,
                  }))
                }
              >
                {column.header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border border-kenya-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-kenya-border bg-kenya-gray/50">
              {columns.map((column) => (
                <th
                  key={column.accessorKey}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ display: columnVisibility[column.accessorKey] ?? true ? '' : 'none' }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-kenya-border">
            {filteredData.map((row: any, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.accessorKey}
                    className="px-4 py-3 text-sm text-kenya-black"
                    style={{ display: columnVisibility[column.accessorKey] ?? true ? '' : 'none' }}
                  >
                    {column.cell ? column.cell(row) : (row[column.accessorKey] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { DataTable }
