import React from 'react'
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

const ANALYTICS_QUERY = {
    result: {
        resource: 'analytics',
        params: ({ dxIds }) => ({
            dimension: `dx:${dxIds.join(';')}`,
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

// TODO: Make two components to avoid double dataStore queries (unless they're cached)
export function GeneratedTable() {
    const { id } = useParams()
    const [savedTable] = useSavedObject(id)
    console.log('Saved table', savedTable)

    // 1. Filter ids from saved table + make a big list
    const dxIds = getDxIds(savedTable.rows)
    console.log('dxIds', dxIds)

    // 3. Make analytics query
    const { data, loading, error } = useDataQuery(ANALYTICS_QUERY, {
        variables: { dxIds },
    })
    if (loading) return <p>Loading...</p>
    if (error) return <p>Oops! There was an error.</p>
    console.log('Result', data.result)

    // 4. Map results: id: value
    const resultMap = new Map(data.result.rows)
    console.log('Result map', resultMap)

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
        <div id="generated-table">
            <h1>{savedTable.name}</h1>
            <h3>Period: todo; Org unit: todo</h3>
            <Table>
                <TableHead>{tableHeader()}</TableHead>
                <TableBody>{tableBody()}</TableBody>
            </Table>
        </div>
    )
}

export default GeneratedTable
