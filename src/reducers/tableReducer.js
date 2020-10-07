import reorderArray from '../modules/reorderArray'
import { defaultCell } from '../modules/defaultTable'

export const ADD_ROW = 'ADD_ROW'
export const UPDATE_ROW = 'UPDATE_ROW'
export const REORDER_ROW = 'REORDER_ROW'
export const DELETE_ROW = 'DELETE_ROW'
export const ADD_COLUMN = 'ADD_COLUMN'
export const UPDATE_COLUMN = 'UPDATE_COLUMN'
export const REORDER_COLUMN = 'REORDER_COLUMN'
export const DELETE_COLUMN = 'DELETE_COLUMN'
export const UPDATE_CELL = 'UPDATE_CELL'

// TODO: Define default values for cells to replace 'null'
// const defaultCell = 'todo'

export function tableReducer(table, { type, payload }) {
    switch (type) {
        case ADD_ROW:
            return {
                ...table,
                rows: table.rows.concat({
                    name: payload.name,
                    // TODO: Default cell value?
                    cells: Array(table.columns.length).fill(defaultCell),
                }),
            }
        case UPDATE_ROW:
            return {
                ...table,
                rows: table.rows.map((row, idx) =>
                    idx === payload.idx ? { ...row, ...payload.row } : row
                ),
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
                // ...table,
                columns: table.columns.concat({ name: payload.name }),
                rows: table.rows.map(row => ({
                    ...row,
                    // TODO: default cell value?
                    cells: row.cells.concat(defaultCell),
                })),
            }
        case UPDATE_COLUMN:
            return {
                ...table,
                columns: table.columns.map((col, idx) =>
                    idx === payload.idx ? { ...col, ...payload.column } : col
                ),
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
            return table
    }
}

export default tableReducer
