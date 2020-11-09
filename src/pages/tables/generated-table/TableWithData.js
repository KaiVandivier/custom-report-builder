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

// Preious data queries:
/* 
// TODO:
// - Optimize DxIds fn
// - Don't fire query if there's no data dimensions

const ANALYTICS_QUERY = {
    result: {
        resource: 'analytics',
        params: ({ dxIds, ouIds = 'LEVEL-1', peIds = '2020' }) => ({
            dimension: `dx:${dxIds.join(';')}`,
            filter: [
                `ou:${ouIds.length ? ouIds : 'LEVEL-1'}`,
                `pe:${peIds.length ? peIds : 'THIS_YEAR'}`,
            ],
            skipMeta: true,
        }),
    },
}

// TODO: Memoize
function getDxIds(rows) {
    // 1. Get all cells in a flat array
    const allCells = rows.map(row => row.cells).flat()

    // 2. Filter out cells without data dimension
    const cellsWithData = allCells.filter(cell => cell?.item?.id)

    // 3. Map to cell.item.id
    const dxIds = cellsWithData.map(cell => cell.item?.id)
    return dxIds
}

function getSelectedIds(selectedItems) {
    return selectedItems.map(({ id }) => id).join(';')
}


    const {
        data,
        loading,
        error,
        called,
        refetch,
    } = useDataQuery(ANALYTICS_QUERY, { lazy: true })

    useEffect(() => {
        // TODO: Remove after testing
        console.log('Using effect', { selectedOrgUnits, selectedPeriods })

        // TODO: Handle if no cells require table-wide ou or pe
        // e.g. 'if (no cells require table-wide vals) continue'
        if (!selectedOrgUnits.length || !selectedPeriods.length) return

        const dxIds = getDxIds(table.rows)
        const ouIds = getSelectedIds(selectedOrgUnits)
        const peIds = getSelectedIds(selectedPeriods)

        refetch({ dxIds, ouIds, peIds })
    }, [savedTable, selectedOrgUnits, selectedPeriods])

    if (!called) return <p>Waiting for params...</p>
    if (loading) return <p>Loading...</p>
    if (error) return <p>Oops! There was an error.</p>

    // Convert results to map - id: value
    const resultMap = new Map(data.result.rows)
*/

// <TableCell key={idx}>
//     {resultMap.get(cell?.item?.id) || null}
// </TableCell>
