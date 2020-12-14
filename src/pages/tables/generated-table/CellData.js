import React, { useEffect } from 'react'
import { CircularLoader, Tooltip } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import i18n from '../../../locales'

const ANALYTICS_QUERY = {
    result: {
        resource: 'analytics',
        params: ({ dxId, ouId, peId }) => ({
            dimension: `dx:${dxId}`,
            filter: [ouId.length ? `ou:${ouId}` : '', `pe:${peId}`],
            skipMeta: true,
        }),
    },
}

function getSelectedIds(selectedItems) {
    return selectedItems.map(({ id }) => id).join(';')
}

function getSelectedNames(selectedItems) {
    return selectedItems.map(({ name }) => name).join(', ')
}

function CellData({ cell, selectedOrgUnits, selectedPeriods, onLoad }) {
    if (!cell.data.item) return null

    const queryVars = {
        dxId: cell.data.item.id,
        ouId: cell.data.orgUnits?.length
            ? getSelectedIds(cell.data.orgUnits)
            : getSelectedIds(selectedOrgUnits),
        peId: cell.data.periods?.length
            ? getSelectedIds(cell.data.periods)
            : getSelectedIds(selectedPeriods),
    }

    const { data, loading, error, refetch } = useDataQuery(ANALYTICS_QUERY, {
        variables: queryVars,
        onComplete: ({ result }) =>
            result.rows.length && onLoad(result.rows[0][1]),
    })

    // Make sure query updates in response to new props
    useEffect(() => {
        refetch(queryVars)
    }, [cell, selectedOrgUnits, selectedPeriods])

    // Maybe, with period and ou footnotes, this just needs to show data item
    function getTooltipContent() {
        return `\
            Data item: ${cell.data.item.name}.
            Org. unit: ${
                cell.data.orgUnits?.length
                    ? getSelectedNames(cell.data.orgUnits)
                    : getSelectedNames(selectedOrgUnits)
            }.
            Period: ${
                cell.data.periods?.length
                    ? getSelectedNames(cell.data.periods)
                    : getSelectedNames(selectedPeriods)
            }.
        `
    }

    if (loading) return <CircularLoader small />
    if (error) {
        console.error(error)
        return <>{i18n.t('Oops! Something went wrong.')}</>
    }

    return (
        <Tooltip content={getTooltipContent()}>
            {props => (
                <span {...props}>
                    {data.result.rows.length ? data.result.rows[0][1] : '-'}
                    {/* If OU, add ou footnote */}
                    {/* If PE, add pe footnote */}
                    {/* Add comma between if there are both */}
                </span>
            )}
        </Tooltip>
    )
}

CellData.propTypes = {
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
    onLoad: PropTypes.func,
}

export default CellData
