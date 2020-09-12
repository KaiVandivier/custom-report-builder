import React, { useReducer } from 'react'
import {
    Button,
    ButtonStrip,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
import i18n from '../../locales'

import { DataEntryCell } from './DataEntryCell'
import tableReducer from '../../reducers/tableReducer'
// Testing purposes (TODO: Remove when functional)
import testTable from '../../modules/testTable'

// TODO:
// DONE - Apply reducer to manage table state
// DONE - Template out table components from state
// Give subcomponents `dispatch` functionality to modify state (import action types)
// (add row/column, update+reorder+delete row/column, update cell)
// create `add row/column` modals
// create controls to update/reorder/delete on each row and column

export function TemplatingTable() {
    const [table, dispatch] = useReducer(tableReducer, testTable)

    function tableColumns() {
        // TODO: Make custom component to handle edit/reorder/delete
        return (
            <TableRowHead>
                <TableCellHead>{i18n.t('Row name')}</TableCellHead>
                {table.columns.map((col, idx) => (
                    <TableCellHead data-idx={idx} key={idx}>
                        {col.name}
                    </TableCellHead>
                ))}
            </TableRowHead>
        )
    }

    function mapCellsToJsx(cells) {
        return cells.map((cell, idx) => (
            // TODO: Add props
            <DataEntryCell data-idx={idx} key={idx} dispatch={dispatch} />
        ))
    }

    function tableRows() {
        return table.rows.map((row, idx) => (
            // TODO: Make custom header to handle edit/reorder/deleteuops
            <TableRow data-idx={idx} key={idx}>
                <TableCell>{row.name}</TableCell>
                {mapCellsToJsx(row.cells)}
            </TableRow>
        ))
    }
    return (
        <>
            {/* TODO: Make `Add Row/Column` components */}
            <ButtonStrip>
                <Button primary>{i18n.t('+ Row')}</Button>
                <Button primary>{i18n.t('+ Column')}</Button>
            </ButtonStrip>
            <Table>
                <TableHead>{tableColumns()}</TableHead>
                <TableBody>{tableRows()}</TableBody>
            </Table>
        </>
    )
}
