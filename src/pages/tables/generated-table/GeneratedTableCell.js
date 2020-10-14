import React, { useEffect } from 'react'
import { CircularLoader, TableCell } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import i18n from '../../../locales'

const CELL_QUERY = {
    result: {
        resource: 'analytics',
        params: ({ dxId, ouId, peId }) => ({
            dimension: `dx:${dxId}`,
            filter: [`ou:${ouId}`, `pe:${peId}`],
        }),
    },
}

function getSelectedIds(selectedItems) {
    return selectedItems.map(({ id }) => id).join(';')
}

// function getSelectedNames(selectedItems) {
//     return selectedItems.map(({ name }) => name).join(', ')
// }

export function GeneratedTableCell({
    cell,
    selectedOrgUnits,
    selectedPeriods,
}) {
    // TODO: Handle empty cell
    if (!cell) return <TableCell />

    // TODO: Handle cell with fixed text
    // (Maybe cells should get different components based on their content type)
    if (cell.contentType === 'text') return <TableCell>{cell.text}</TableCell>

    const queryVars = {
        dxId: cell.item.id,
        ouId: cell.orgUnit?.id || getSelectedIds(selectedOrgUnits),
        peId: cell.period?.id || getSelectedIds(selectedPeriods),
    }

    // Problem: this doesn't update with props
    const { data, loading, error, refetch } = useDataQuery(CELL_QUERY, {
        variables: queryVars,
    })

    useEffect(() => {
        refetch(queryVars)
    }, [cell, selectedOrgUnits, selectedPeriods])

    // TODO: Make a nice glow, like storybook (transparent text, background, animate background opacity): /src/index.css/ -> '.glow-text'
    if (loading)
        return (
            <TableCell>
                <CircularLoader small />
            </TableCell>
        )

    if (error) {
        console.error(error)
        return <TableCell>{i18n.t('Oops! Something went wrong.')}</TableCell>
    }

    console.log(data)

    return <TableCell>{data.result.rows[0][1]}</TableCell>
}

GeneratedTableCell.propTypes = {
    cell: PropTypes.shape(),
    selectedOrgUnits: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ),
    selectedPeriods: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ),
}

export default GeneratedTableCell
