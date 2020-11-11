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
    colors,
} from '@dhis2/ui'
import { useParams, useHistory } from 'react-router-dom'

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
import { useTableActions, useTableState } from '../../context/tableContext'

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
                    <ColumnControls
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
                key={idx}
            />
        ))
    }

    function tableRows() {
        return table.rows.map((row, idx, arr) => (
            <TableRow idx={idx} key={idx}>
                <RowControls row={row} idx={idx} maxIdx={arr.length - 1} />
                {mapCellsToJsx(row.cells, idx)}
            </TableRow>
        ))
    }

    return (
        <>
            <header>
                <BackButton to={TABLES} text={i18n.t('Back to Saved Tables')} />
                <div className="pageTitle">
                    <h1>{i18n.t('Edit Table Template')}</h1>
                    <a
                        href={`${HELP}#editing-a-table-template`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <IconTooltipButton
                            tooltip={i18n.t('Help')}
                            icon="help"
                            color={colors.blue700}
                            size="32px"
                        />
                    </a>
                </div>
            </header>
            <section className="container">
                <h6 className="label">{i18n.t('Table name')}</h6>
                <div className="tableName">
                    <h3>{table.name}</h3>
                    <RenameTable name={table.name} onRename={renameTable} />
                </div>
            </section>
            <section className="container">
                <h6 className="label">{i18n.t('Highlighting')}</h6>
                <HighlightingEditor />
            </section>
            <div className="tableButtons">
                <div className="tableButtons__left">
                    <ButtonStrip className="dimension-buttons">
                        <AddTableDimension type="Row" />
                        <AddTableDimension type="Column" />
                    </ButtonStrip>
                </div>

                <div className="tableButtons__right">
                    <EditTableTemplateActions
                        onGenerate={onGenerate}
                        onDelete={onDelete}
                    />
                </div>
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
