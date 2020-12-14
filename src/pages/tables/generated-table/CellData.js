import React, { useEffect } from 'react'
import { CircularLoader, Tooltip } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import i18n from '../../../locales'
import { useFootnotes } from '../../../context/footnotesContext'

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

    const { orgUnitFootnotes, periodFootnotes } = useFootnotes()

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

    function getFootnotes() {
        const footnotes = []
        // If ou, add sup
        if (cell.data.orgUnits.length > 0) {
            // get key as list of ids
            const key = getSelectedIds(cell.data.orgUnits)
            // check map for existing footnote
            let footnote = orgUnitFootnotes.get(key)
            if (footnote === undefined) {
                footnote = {
                    id: `ou${orgUnitFootnotes.size + 1}`,
                    description: getSelectedNames(cell.data.orgUnits),
                }
                orgUnitFootnotes.set(key, footnote)
            }
            footnotes.push(footnote)
        }
        // If pe, add sup
        if (cell.data.periods.length > 0) {
            // get key as list of ids
            const key = getSelectedIds(cell.data.periods)
            // check map for existing footnote
            let footnote = periodFootnotes.get(key)
            if (footnote === undefined) {
                footnote = {
                    id: `p${periodFootnotes.size + 1}`,
                    description: getSelectedNames(cell.data.periods),
                }
                periodFootnotes.set(key, footnote)
            }
            footnotes.push(footnote)
        }
        if (footnotes.length === 0) return null
        // Add commma between
        return (
            <span>
                {' '}
                <sup>{footnotes.map(({ id }) => id).join(', ')}</sup>
            </span>
        )
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
                    {getFootnotes()}
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
