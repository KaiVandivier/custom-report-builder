import React, { useEffect } from 'react'
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
import { GeneratedTableCell } from './GeneratedTableCell'
import { useTableState } from '../../../context/tableContext'
import { useFootnotes } from '../../../context/footnotesContext'
import Footnotes from './Footnotes'

export function getSelectedIds(selectedItems) {
    return selectedItems.map(({ id }) => id).join(';')
}

export function getSelectedNames(selectedItems) {
    return selectedItems.map(({ name }) => name).join(', ')
}

function populateFootnotes(table, footnotes) {
    const { setOrgUnitFootnotes, setPeriodFootnotes } = footnotes
    const orgUnitFootnotes = new Map()
    const periodFootnotes = new Map()

    // For each cell, add footnotes for any unique org unit(s) or period(s)
    table.rows.forEach(row => {
        row.cells.forEach(cell => {
            if (cell.data.orgUnits.length > 0) {
                // get key as list of ids
                const key = getSelectedIds(cell.data.orgUnits)

                // check map for existing footnote; add if absent
                if (orgUnitFootnotes.get(key) === undefined) {
                    const newFootnote = {
                        id: `ou${orgUnitFootnotes.size + 1}`,
                        description: getSelectedNames(cell.data.orgUnits),
                    }
                    // TODO: replace with map.set(...)
                    // addOrgUnitFootnote(key, newFootnote)
                    orgUnitFootnotes.set(key, newFootnote)
                }
            }

            if (cell.data.periods.length > 0) {
                // get key as list of ids
                const key = getSelectedIds(cell.data.periods)

                // check map for existing footnote; add if absent
                if (periodFootnotes.get(key) === undefined) {
                    const newFootnote = {
                        id: `p${periodFootnotes.size + 1}`,
                        description: getSelectedNames(cell.data.periods),
                    }

                    // addPeriodFootnote(key, newFootnote)
                    periodFootnotes.set(key, newFootnote)
                }
            }
        })
    })

    setOrgUnitFootnotes(orgUnitFootnotes)
    setPeriodFootnotes(periodFootnotes)
}

export function TableWithData({
    periodParamNeeded,
    selectedOrgUnits,
    selectedPeriods,
}) {
    const table = useTableState()
    const footnotes = useFootnotes()

    useEffect(() => {
        populateFootnotes(table, footnotes)
    }, [])

    if (periodParamNeeded && !selectedPeriods.length)
        return <p>Waiting for parameters...</p>

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

            <Footnotes />

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
