import React, { useEffect } from 'react'
import { CircularLoader } from '@dhis2/ui'
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

// function getSelectedNames(selectedItems) {
//     return selectedItems.map(({ name }) => name).join(', ')
// }

export function CellData({ cell, selectedOrgUnits, selectedPeriods }) {
    const queryVars = {
        dxId: cell.item.id,
        ouId: cell.orgUnit?.id || getSelectedIds(selectedOrgUnits),
        peId: cell.period?.id || getSelectedIds(selectedPeriods),
    }

    // Problem: this doesn't update with props
    const { data, loading, error, refetch } = useDataQuery(ANALYTICS_QUERY, {
        variables: queryVars,
    })

    useEffect(() => {
        refetch(queryVars)
    }, [cell, selectedOrgUnits, selectedPeriods])

    // TODO: Make a nice glow, like storybook (transparent text, background, animate background opacity): /src/index.css/ -> '.glow-text'
    if (loading) return <CircularLoader small />
    if (error) {
        console.error(error)
        return <>{i18n.t('Oops! Something went wrong.')}</>
    }

    console.log(data)

    // TODO: Make sure there's data in the rows, or it throws 'undefined' error
    // TODO: Make a tooltip
    return <span>{data.result.rows.length ? data.result.rows[0][1] : '-'}</span>
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
