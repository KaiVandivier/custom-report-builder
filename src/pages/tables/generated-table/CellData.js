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
            filter: [`ou:${ouId}`, `pe:${peId}`],
        }),
    },
}

function getSelectedIds(selectedItems) {
    return selectedItems.map(({ id }) => id).join(';')
}

function getSelectedNames(selectedItems) {
    return selectedItems.map(({ name }) => name).join(', ')
}

export function CellData({ cell, selectedOrgUnits, selectedPeriods }) {
    const queryVars = {
        dxId: cell.item.id,
        ouId: cell.orgUnits?.length
            ? getSelectedIds(cell.orgUnits)
            : getSelectedIds(selectedOrgUnits),
        peId: cell.periods?.length
            ? getSelectedIds(cell.periods)
            : getSelectedIds(selectedPeriods),
    }

    const { data, loading, error, refetch } = useDataQuery(ANALYTICS_QUERY, {
        variables: queryVars,
    })

    // Make sure query updates in response to new props
    useEffect(() => {
        refetch(queryVars)
    }, [cell, selectedOrgUnits, selectedPeriods])

    if (loading) return <CircularLoader small />
    if (error) {
        console.error(error)
        return <>{i18n.t('Oops! Something went wrong.')}</>
    }

    const tooltipContent = `\
        Data item: ${cell.item.name}.
        Org. unit: ${
            cell.orgUnits?.length
                ? getSelectedNames(cell.orgUnits)
                : getSelectedNames(selectedOrgUnits)
        }.
        Period: ${
            cell.periods?.length
                ? getSelectedNames(cell.periods)
                : getSelectedNames(selectedPeriods)
        }.
    `

    return (
        <Tooltip content={tooltipContent}>
            {props => (
                <span {...props}>
                    {data.result.rows.length ? data.result.rows[0][1] : '-'}
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
}

export default CellData
