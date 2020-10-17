import React, { useReducer, useEffect } from 'react'
// import PropTypes from 'prop-types'
import {
    ButtonStrip,
    Card,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
} from '@dhis2/ui'
import { useSavedObject } from '@dhis2/app-service-datastore'
import { useParams, useHistory } from 'react-router-dom'

import tableReducer from '../../reducers/tableReducer'
import styles from './styles/EditTableTemplate.style'
import {
    EditTableCell,
    AddTableDimension,
    RowControls,
    ColumnControls,
    RenameTable,
    EditTableTemplateActions,
} from './edit-table-template'
import BackButton from '../../components/BackButton'
import utils from '../../styles/utils.module.css'

// TODO:
// DONE - Apply reducer to manage table state
// DONE - Template out table components from state
// DONE - (Start with cells; rows and columns will follow with later todos)
// DONE - create `add row/column` modals
// DONE - Give subcomponents `dispatch` functionality to modify state (import action types)
// DONE - create controls to update/reorder/delete on each row and column
// DONE - Load in initial template datastore using params.id
// DONE - Save template to datastore
// DONE - Add rename button
// DONE - Add `save & generate` & `delete` buttons

// - `save & exit`?
// - Exit

export function EditTableTemplate() {
    const params = useParams()
    const [savedTable, savedTableActions] = useSavedObject(params.id)
    const [table, dispatch] = useReducer(tableReducer, savedTable)
    const history = useHistory()

    // Save table in response to changes
    useEffect(() => {
        savedTableActions.update({ ...table })
    }, [table])

    function onDelete() {
        savedTableActions.remove(params.id)
        history.push('/tables')
    }

    function onGenerate() {
        history.push(`/tables/generated/${params.id}`)
    }

    function renameTable(name) {
        savedTableActions.update({ name })
    }

    function tableColumns() {
        return (
            <TableRowHead>
                <TableCellHead />
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
            <EditTableCell
                rowIdx={rowIdx}
                cellIdx={idx}
                cell={cell}
                dispatch={dispatch}
                key={idx}
            />
        ))
    }

    function tableRows() {
        return table.rows.map((row, idx, arr) => (
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
            <div className="header">
                <BackButton to="/tables" />
                <h1>{savedTable.name}</h1>
                <div className="editButton">
                    <RenameTable
                        name={savedTable.name}
                        onRename={renameTable}
                    />
                </div>
            </div>
            <div className="tableButtons">
                <ButtonStrip className="dimension-buttons">
                    <AddTableDimension type="Row" dispatch={dispatch} />
                    <AddTableDimension type="Column" dispatch={dispatch} />
                </ButtonStrip>
                <EditTableTemplateActions
                    onGenerate={onGenerate}
                    onDelete={onDelete}
                />
            </div>
            <Card className={utils.card}>
                <Table className={utils.noBorder}>
                    <TableHead>{tableColumns()}</TableHead>
                    <TableBody>{tableRows()}</TableBody>
                </Table>
            </Card>
            <style jsx>{styles}</style>
        </>
    )
}

EditTableTemplate.propTypes = {}

export default EditTableTemplate
