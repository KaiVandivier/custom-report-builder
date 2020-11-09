import React from 'react'
import PropTypes from 'prop-types'
import {
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
} from '@dhis2/ui'
import i18n from '../../../locales'

import styles from './styles/TableWithData.styles'
import GeneratedTableCell from './GeneratedTableCell'
import { useTableState } from '../../../context/tableContext'

function getSelectedNames(selectedItems) {
    return selectedItems.map(({ name }) => name).join(', ')
}

export function TableWithData({
    periodParamNeeded,
    selectedOrgUnits,
    selectedPeriods,
}) {
    const table = useTableState()

    if (periodParamNeeded && !selectedPeriods.length)
        return <p>Waiting for parameters...</p>

    // Render table by iterating over all cells, and for each, looking up value in map
    function tableHeader() {
        return (
            <TableRowHead>
                <TableCellHead />
                {table.columns.map((col, idx) => (
                    <TableCellHead key={idx}>{col.name}</TableCellHead>
                ))}
            </TableRowHead>
        )
    }

    function mapCellValues(cell, idx) {
        return (
            <GeneratedTableCell
                key={idx}
                cell={cell}
                selectedOrgUnits={selectedOrgUnits}
                selectedPeriods={selectedPeriods}
            />
        )
    }

    function tableBody() {
        return table.rows.map((row, idx) => (
            <TableRow key={idx}>
                <TableCellHead>{row.name}</TableCellHead>
                {row.cells.map(mapCellValues)}
            </TableRow>
        ))
    }

    return (
        <>
            <h2 className="title">{table.name}</h2>
            {selectedOrgUnits.length ? (
                <p>
                    {i18n.t('Organisation Unit{{s}} - {{ou}}', {
                        s: selectedOrgUnits.length > 1 ? 's' : '',
                        ou: getSelectedNames(selectedOrgUnits),
                    })}
                </p>
            ) : null}
            {selectedPeriods.length ? (
                <p>
                    {i18n.t('Period{{s}} - {{pe}}', {
                        s: selectedPeriods.length > 1 ? 's' : '',
                        pe: getSelectedNames(selectedPeriods),
                    })}
                </p>
            ) : null}
            <p>
                {i18n.t('Date - ')}
                {new Date().toLocaleDateString()}
            </p>
            <Table>
                <TableHead>{tableHeader()}</TableHead>
                <TableBody>{tableBody()}</TableBody>
            </Table>
            <style jsx>{styles}</style>
        </>
    )
}

TableWithData.propTypes = {
    periodParamNeeded: PropTypes.bool.isRequired,
    selectedOrgUnits: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
    selectedPeriods: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
}

export default TableWithData
