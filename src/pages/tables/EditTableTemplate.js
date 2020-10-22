import React, { useReducer, useEffect } from 'react'
// import PropTypes from 'prop-types'
import {
    ButtonStrip,
    Card,
    Help,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    colors,
} from '@dhis2/ui'
import { useSavedObject } from '@dhis2/app-service-datastore'
import { useParams, useHistory, Link } from 'react-router-dom'

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
import i18n from '../../locales'
import IconTooltipButton from '../../components/IconTooltipButton'

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
                        col={col}
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
                    row={row}
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
                <BackButton to="/tables" tooltip={i18n.t('Back to Tables')} />
                <h1>{savedTable.name}</h1>
                <div className="editButton">
                    <RenameTable
                        name={savedTable.name}
                        onRename={renameTable}
                    />
                </div>
            </div>
            <div className="tableButtons">
                <div className="tableButtons__left">
                    <ButtonStrip className="dimension-buttons">
                        <AddTableDimension type="Row" dispatch={dispatch} />
                        <AddTableDimension type="Column" dispatch={dispatch} />
                    </ButtonStrip>
                </div>
                <Link
                    to={'/information'}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <IconTooltipButton
                        tooltip={i18n.t('Information')}
                        icon="help"
                        color={colors.blue700}
                        size="32px"
                    />
                </Link>
                <div className="tableButtons__right">
                    <EditTableTemplateActions
                        onGenerate={onGenerate}
                        onDelete={onDelete}
                    />
                </div>
            </div>
            <div className="help">
                <Help>
                    {i18n.t(
                        '*Any cells with unspecified organisation units or periods will use the respective parameters selected during report generation.'
                    )}
                </Help>
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
