import React, { useReducer } from 'react'
import {
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
} from '@dhis2/ui'
import i18n from '../../locales'

import DataEntryCell from './DataEntryCell'
import AddTableDimension from './AddTableDimension'
import RowControls from './RowControls'
import tableReducer from '../../reducers/tableReducer'
import styles from './styles/ModifyTemplate.style'
// Testing purposes (TODO: Remove when functional)
import testTable from '../../modules/testTable'
import ColumnControls from './ColumnControls'

// TODO:
// DONE - Apply reducer to manage table state
// DONE - Template out table components from state
// DONE - (Start with cells; rows and columns will follow with later todos)
// DONE - create `add row/column` modals
// WIP - Give subcomponents `dispatch` functionality to modify state (import action types)
// create controls to update/reorder/delete on each row and column

export function TemplatingTable() {
    const [table, dispatch] = useReducer(tableReducer, testTable)

    function tableColumns() {
        return (
            <TableRowHead>
                <TableCellHead>{i18n.t('Row name')}</TableCellHead>
                {table.columns.map((col, idx, arr) => (
                    // TODO: Make custom component to handle edit/reorder/delete
                    // <TableCellHead data-idx={idx} key={idx}>
                    // {/* {col.name} */}
                    <ColumnControls
                        dispatch={dispatch}
                        name={col.name}
                        idx={idx}
                        maxIdx={arr.length - 1}
                        key={idx}
                    />
                    // </TableCellHead>
                ))}
            </TableRowHead>
        )
    }

    function mapCellsToJsx(cells, rowIdx) {
        return cells.map((cell, idx) => (
            <DataEntryCell
                rowIdx={rowIdx}
                cellIdx={idx}
                values={cell}
                dispatch={dispatch}
                key={idx}
            />
        ))
    }

    function tableRows() {
        return table.rows.map((row, idx, arr) => (
            // TODO: Make custom header to handle edit/reorder/deleteuops
            <TableRow idx={idx} key={idx}>
                {/* <TableCellHead>{row.name}</TableCellHead> */}
                <RowControls
                    dispatch={dispatch}
                    name={row.name}
                    idx={idx}
                    maxIdx={arr.length - 1}
                />
                {mapCellsToJsx(row.cells, idx)}
            </TableRow>
        ))
    }
    return (
        <>
            {/* TODO: Make `Add Row/Column` components */}
            <div className="dimension-buttons">
                <AddTableDimension type="Row" dispatch={dispatch} />
                <AddTableDimension type="Column" dispatch={dispatch} />
            </div>
            <Table>
                <TableHead>{tableColumns()}</TableHead>
                <TableBody>{tableRows()}</TableBody>
            </Table>
            <style jsx>{styles}</style>
        </>
    )
}
