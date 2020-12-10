import reorderArray from '../modules/reorderArray'
import { defaultCell } from '../modules/defaultTable'

export const UPDATE_TABLE = 'UPDATE_TABLE'
export const ADD_ROW = 'ADD_ROW'
export const UPDATE_ROW = 'UPDATE_ROW'
export const REORDER_ROW = 'REORDER_ROW'
export const DELETE_ROW = 'DELETE_ROW'
export const ADD_COLUMN = 'ADD_COLUMN'
export const UPDATE_COLUMN = 'UPDATE_COLUMN'
export const REORDER_COLUMN = 'REORDER_COLUMN'
export const DELETE_COLUMN = 'DELETE_COLUMN'
export const UPDATE_CELL = 'UPDATE_CELL'
export const UPDATE_ROW_DIMENSIONS = 'UPDATE_ROW_DIMENSIONS'
export const UPDATE_COLUMN_DIMENSIONS = 'UPDATE_COLUMN_DIMENSIONS'
export const UPDATE_ROW_HIGHLIGHTING = 'UPDATE_ROW_HIGHLIGHTING'
export const UPDATE_COLUMN_HIGHLIGHTING = 'UPDATE_COLUMN_HIGHLIGHTING'

export default function tableReducer(table, { type, payload }) {
    switch (type) {
        case UPDATE_TABLE:
            return {
                ...table,
                ...payload,
            }
        case ADD_ROW:
            return {
                ...table,
                rows: table.rows.concat({
                    name: payload.name,
                    cells: table.columns.map(col => ({
                        ...defaultCell,
                        data: { ...defaultCell.data, ...col.dimensions },
                        highlightingIntervals: col.highlightingIntervals
                            ? [...col.highlightingIntervals]
                            : null,
                    })),
                }),
            }
        case UPDATE_ROW:
            return {
                ...table,
                rows: table.rows.map((row, idx) =>
                    idx === payload.idx ? { ...row, ...payload.row } : row
                ),
            }
        case UPDATE_ROW_DIMENSIONS:
            // adds dimensions to `row.dimensions` and all `cell.data` in row
            return {
                ...table,
                rows: table.rows.map((row, idx) => {
                    if (idx !== payload.idx) return row
                    return {
                        ...row,
                        dimensions: {
                            ...row.dimensions,
                            ...payload.dimensions,
                        },
                        cells: row.cells.map(cell => ({
                            ...cell,
                            data: { ...cell.data, ...payload.dimensions },
                        })),
                    }
                }),
            }
        case UPDATE_ROW_HIGHLIGHTING:
            // add highlighting intervals to row and all cells within
            // to clear, use payload `{ highlightingIntervals: null }`
            return {
                ...table,
                rows: table.rows.map((row, idx) => {
                    if (idx !== payload.idx) return row
                    return {
                        ...row,
                        highlightingIntervals: payload.highlightingIntervals,
                        cells: row.cells.map((cell, idx) => ({
                            ...cell,
                            highlightingIntervals:
                                payload.highlightingIntervals ||
                                table.columns[idx].highlightingIntervals ||
                                null,
                        })),
                    }
                }),
            }
        case REORDER_ROW:
            return {
                ...table,
                rows: reorderArray(table.rows, payload.oldIdx, payload.newIdx),
            }
        case DELETE_ROW:
            return {
                ...table,
                rows: table.rows.filter((row, idx) => idx !== payload.idx),
            }
        case ADD_COLUMN:
            return {
                ...table,
                columns: table.columns.concat({ name: payload.name }),
                rows: table.rows.map(row => ({
                    ...row,
                    cells: row.cells.concat({
                        ...defaultCell,
                        data: { ...defaultCell.data, ...row.dimensions },
                        highlightingIntervals: row.highlightingIntervals
                            ? [...row.highlightingIntervals]
                            : null,
                    }),
                })),
            }
        case UPDATE_COLUMN:
            return {
                ...table,
                columns: table.columns.map((col, idx) =>
                    idx === payload.idx ? { ...col, ...payload.column } : col
                ),
            }
        case UPDATE_COLUMN_DIMENSIONS:
            // adds dimensions to `col.dimensions` and all `cell.data` in column
            return {
                ...table,
                columns: table.columns.map((col, idx) => {
                    if (idx !== payload.idx) return col
                    return {
                        ...col,
                        dimensions: {
                            ...col.dimensions,
                            ...payload.dimensions,
                        },
                    }
                }),
                rows: table.rows.map(row => {
                    return {
                        ...row,
                        cells: row.cells.map((cell, cellIdx) => {
                            if (cellIdx !== payload.idx) return cell
                            return {
                                ...cell,
                                data: { ...cell.data, ...payload.dimensions },
                            }
                        }),
                    }
                }),
            }
        case UPDATE_COLUMN_HIGHLIGHTING:
            // adds highlighting interval to column and all cells in column
            // to clear, use payload `{ highlightingIntervals: null }`
            return {
                ...table,
                columns: table.columns.map((col, idx) => {
                    if (idx !== payload.idx) return col
                    return {
                        ...col,
                        highlightingIntervals: payload.highlightingIntervals,
                    }
                }),
                rows: table.rows.map(row => {
                    return {
                        ...row,
                        cells: row.cells.map((cell, idx) => {
                            if (idx !== payload.idx) return cell
                            return {
                                ...cell,
                                highlightingIntervals:
                                    payload.highlightingIntervals ||
                                    row.highlightingIntervals ||
                                    null,
                            }
                        }),
                    }
                }),
            }
        case REORDER_COLUMN:
            return {
                ...table,
                columns: reorderArray(
                    table.columns,
                    payload.oldIdx,
                    payload.newIdx
                ),
                rows: table.rows.map(row => ({
                    ...row,
                    cells: reorderArray(
                        row.cells,
                        payload.oldIdx,
                        payload.newIdx
                    ),
                })),
            }
        case DELETE_COLUMN:
            return {
                ...table,
                columns: table.columns.filter(
                    (col, idx) => idx !== payload.idx
                ),
                rows: table.rows.map(row => ({
                    ...row,
                    cells: row.cells.filter((cell, idx) => idx !== payload.idx),
                })),
            }
        case UPDATE_CELL:
            return {
                ...table,
                rows: table.rows.map((row, rowIdx) => {
                    if (rowIdx !== payload.rowIdx) return row
                    return {
                        ...row,
                        cells: row.cells.map((cell, cellIdx) => {
                            if (cellIdx !== payload.cellIdx) return cell
                            return { ...cell, ...payload.cell }
                        }),
                    }
                }),
            }
        default:
            console.error(`Action type '${type}' not valid.`)
            return table
    }
}
