import React, { useReducer } from 'react'
// import PropTypes from 'prop-types'
import {
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
} from '@dhis2/ui'
import { useSavedObject } from '@dhis2/app-service-datastore'
import { useHistory, useParams } from 'react-router-dom'
import i18n from '../../locales'

import DataEntryCell from './DataEntryCell'
import AddTableDimension from './AddTableDimension'
import RowControls from './RowControls'
import tableReducer from '../../reducers/tableReducer'
import styles from './styles/EditTableTemplate.style'
import ColumnControls from './ColumnControls'

// TODO:
// DONE - Apply reducer to manage table state
// DONE - Template out table components from state
// DONE - (Start with cells; rows and columns will follow with later todos)
// DONE - create `add row/column` modals
// WIP - Give subcomponents `dispatch` functionality to modify state (import action types)
// create controls to update/reorder/delete on each row and column

// TODO:
// DONE - Load in initial template datastore using params.id
// - Save template to datastore

export function EditTableTemplate() {
    const params = useParams()
    const [savedTable, savedTableActions] = useSavedObject(params.id)
    const [table, dispatch] = useReducer(tableReducer, savedTable)
    const history = useHistory()
    console.log(history, params)
    console.log(savedTable, savedTableActions)

    function tableColumns() {
        return (
            <TableRowHead>
                <TableCellHead>{i18n.t('Row name')}</TableCellHead>
                {table.columns.map((col, idx, arr) => (
                    <ColumnControls
                        dispatch={dispatch}
                        name={col.name}
                        idx={idx}
                        maxIdx={arr.length - 1}
                        key={idx}
                    />
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
            <h1>{savedTable.name}</h1>
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

EditTableTemplate.propTypes = {}
