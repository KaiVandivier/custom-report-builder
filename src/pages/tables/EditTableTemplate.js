import React, { useEffect } from 'react'
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
import { useParams, useHistory, Link } from 'react-router-dom'

import styles from './styles/EditTableTemplate.style'
import {
    EditTableCell,
    AddTableDimension,
    RowControls,
    HighlightingEditor,
    ColumnControls,
    RenameTable,
    EditTableTemplateActions,
} from './edit-table-template'
import BackButton from '../../components/BackButton'
import utils from '../../styles/utils.module.css'
import i18n from '../../locales'
import IconTooltipButton from '../../components/IconTooltipButton'
import { TABLES, HELP, getPath, GENERATED_TABLE } from '../../modules/paths'
import { useTable } from '../../context/tableContext'

export function EditTableTemplate() {
    const params = useParams()
    const [table, dispatch, dataStoreActions] = useTable()
    const history = useHistory()

    // Save table to datastore in response to changes
    // TODO: Move to TableProvider?
    useEffect(() => {
        dataStoreActions.update({ ...table })
    }, [table])

    function onDelete() {
        dataStoreActions.remove()
        history.push(TABLES)
    }

    function onGenerate() {
        history.push(getPath(GENERATED_TABLE, params.id))
    }

    function renameTable(name) {
        dataStoreActions.update({ name })
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
                <BackButton to={TABLES} tooltip={i18n.t('Back to Tables')} />
                <h1>{table.name}</h1>
                <div className="editButton">
                    <RenameTable name={table.name} onRename={renameTable} />
                </div>
            </div>
            <div className="tableButtons">
                <div className="tableButtons__left">
                    <ButtonStrip className="dimension-buttons">
                        <AddTableDimension type="Row" />
                        <AddTableDimension type="Column" />
                    </ButtonStrip>
                </div>
                <Link to={HELP} target="_blank" rel="noopener noreferrer">
                    <IconTooltipButton
                        tooltip={i18n.t('Help')}
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
            <HighlightingEditor />
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
