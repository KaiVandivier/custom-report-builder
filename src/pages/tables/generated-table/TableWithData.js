import React from 'react'
import PropTypes from 'prop-types'
import { useSavedObject } from '@dhis2/app-service-datastore'
import { useParams } from 'react-router-dom'
import { useDataQuery } from '@dhis2/app-runtime'
import {
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
import i18n from '../../../locales'

import styles from './styles/TableWithData.styles'

// TODO:
// - Filter query based on pe & ou props
// - Optimize DxIds fn
// - Don't fire query if there's no data dimensions

const ANALYTICS_QUERY = {
    result: {
        resource: 'analytics',
        params: ({ dxIds }) => ({
            dimension: `dx:${dxIds.join(';')}`,
            // TODO: Filter based on selected periods & ous
            filter: 'ou:LEVEL-1,pe:2020',
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

export function TableWithData({ selectedOrgUnits, selectedPeriods }) {
    console.log(selectedPeriods, selectedOrgUnits)

    const { id } = useParams()
    const [savedTable] = useSavedObject(id)

    // 1. Filter ids from saved table + make a big list
    const dxIds = getDxIds(savedTable.rows)

    // 3. Make analytics query
    const { data, loading, error } = useDataQuery(ANALYTICS_QUERY, {
        variables: { dxIds },
    })
    if (loading) return <p>Loading...</p>
    if (error) return <p>Oops! There was an error.</p>

    // 4. Map results: id: value
    const resultMap = new Map(data.result.rows)

    // 5. Render table by iterating over all cells, and for each, looking up value in map
    function tableHeader() {
        return (
            <TableRowHead>
                <TableCellHead>{i18n.t('Row name')}</TableCellHead>
                {savedTable.columns.map((col, idx) => (
                    <TableCellHead key={idx}>{col.name}</TableCellHead>
                ))}
            </TableRowHead>
        )
    }

    function mapCellValues(cell, idx) {
        return (
            <TableCell key={idx}>
                {resultMap.get(cell?.item?.id) || 'no value'}
            </TableCell>
        )
    }

    function tableBody() {
        return savedTable.rows.map((row, idx) => (
            <TableRow key={idx}>
                <TableCellHead>{row.name}</TableCellHead>
                {row.cells.map(mapCellValues)}
            </TableRow>
        ))
    }

    return (
        <>
            <h2 className="title">{savedTable.name}</h2>
            <p>{i18n.t('Organisation Unit')}: Sierra Leone</p>
            <p>{i18n.t('Period')}: 2020</p>
            <p>
                {i18n.t('Date')}: {new Date().toLocaleDateString()}
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