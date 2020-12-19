import React, { useEffect } from 'react'
import { CircularLoader, Tooltip } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import cx from 'classnames'
import i18n from '../../../locales'
import { useTableState } from '../../../context/tableContext'
import { getSelectedIds } from './TableWithData'
import FootnoteRefs from './FootnoteRefs'

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

function CellData({ cell, selectedOrgUnits, selectedPeriods }) {
    if (!cell.data.item) return null

    const table = useTableState()

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
    })

    // Make sure query updates in response to new props
    useEffect(() => {
        refetch(queryVars)
    }, [cell, selectedOrgUnits, selectedPeriods])

    function getTooltipContent() {
        return `Data item: ${cell.data.item.name}.`
    }

    function getCellColor() {
        const intervals =
            cell.highlightingIntervals || table.highlightingIntervals
        const value = data.result.rows[0][1]
        for (const { lowerBound, color } of intervals) {
            if (Number(value) >= Number(lowerBound)) return color
        }
    }

    if (loading) return <CircularLoader small />
    if (error) {
        console.error(error)
        return <>{i18n.t('Oops! Something went wrong.')}</>
    }

    return (
        <Tooltip content={getTooltipContent()}>
            {props => (
                <div {...props}>
                    <span
                        className={cx({ highlightingOn: table.highlightingOn })}
                    >
                        {data.result.rows.length ? data.result.rows[0][1] : '-'}
                    </span>

                    <FootnoteRefs cell={cell} />

                    <style jsx>{`
                        .highlightingOn {
                            display: inline-block;
                            padding: 0.5rem;
                            margin: -0.5rem 0rem -0.5rem -0.5rem;
                            background-color: ${getCellColor()};
                        }
                    `}</style>
                </div>
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
