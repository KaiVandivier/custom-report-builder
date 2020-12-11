import React, { useEffect } from 'react'
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
import { useParams, useHistory } from 'react-router-dom'

import styles from './styles/EditTableTemplate.style'
import {
    EditTableCell,
    AddTableDimension,
    HighlightingEditor,
    RowColControls,
    RenameTable,
    EditTableTemplateActions,
} from './edit-table-template'
import BackButton from '../../components/BackButton'
import utils from '../../styles/utils.module.css'
import i18n from '../../locales'
import { TABLES, getPath, GENERATED_TABLE } from '../../modules/paths'
import { useTableActions, useTableState } from '../../context/tableContext'
import HelpButton from '../../components/HelpButton'
import AutosaveStatus from './edit-table-template/AutosaveStatus'

export function EditTableTemplate() {
    const params = useParams()
    const table = useTableState()
    const dataStoreActions = useTableActions()
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
                    <RowColControls
                        type="column"
                        rowColObj={col}
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
                key={idx}
            />
        ))
    }

    function tableRows() {
        return table.rows.map((row, idx, arr) => (
            <TableRow idx={idx} key={idx}>
                <RowColControls
                    type={'row'}
                    rowColObj={row}
                    idx={idx}
                    maxIdx={arr.length - 1}
                />
                {mapCellsToJsx(row.cells, idx)}
            </TableRow>
        ))
    }

    return (
        <>
            <header className="header">
                <div>
                    <BackButton
                        to={TABLES}
                        text={i18n.t('Back to Saved Tables')}
                    />
                    <div className="pageTitle">
                        <h1>{i18n.t('Edit Table Template')}</h1>
                        <HelpButton subsection="#editing-a-table-template" />
                    </div>
                </div>
                <EditTableTemplateActions
                    onGenerate={onGenerate}
                    onDelete={onDelete}
                />
            </header>
            <section className="controls">
                <div>
                    <div className="container">
                        <h6 className="label">{i18n.t('Table name')}</h6>
                        <div className="tableName">
                            <div>{table.name}</div>
                            <RenameTable
                                name={table.name}
                                onRename={renameTable}
                            />
                        </div>
                    </div>
                    <HighlightingEditor />
                </div>
                <ButtonStrip end>
                    <AddTableDimension type="Row" />
                    <AddTableDimension type="Column" />
                </ButtonStrip>
            </section>
            <section>
                <Card className={utils.card}>
                    <Table className={utils.noBorder}>
                        <TableHead>{tableColumns()}</TableHead>
                        <TableBody>{tableRows()}</TableBody>
                    </Table>
                </Card>
            </section>
            <footer>
                <AutosaveStatus />
            </footer>
            <style jsx>{styles}</style>
        </>
    )
}

EditTableTemplate.propTypes = {}

export default EditTableTemplate
