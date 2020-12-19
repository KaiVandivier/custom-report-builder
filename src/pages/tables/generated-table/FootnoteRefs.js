import React from 'react'
import PropTypes from 'prop-types'
import { colors } from '@dhis2/ui'
import { useFootnotes } from '../../../context/footnotesContext'
import { getSelectedIds } from './TableWithData'

function FootnoteRefs({ cell }) {
    const { periodFootnotes, orgUnitFootnotes } = useFootnotes()

    const footnotes = []

    // If ou, add sup
    if (cell.data.orgUnits.length > 0) {
        // get key as list of ids
        const key = getSelectedIds(cell.data.orgUnits)
        const footnote = orgUnitFootnotes.get(key)
        if (footnote !== undefined) footnotes.push(footnote)
    }

    // If pe, add sup
    if (cell.data.periods.length > 0) {
        const key = getSelectedIds(cell.data.periods)
        const footnote = periodFootnotes.get(key)
        if (footnote !== undefined) footnotes.push(footnote)
    }

    if (footnotes.length === 0) return null

    return (
        <sup>
            {footnotes.map(({ id }) => id).join(', ')}
            <style jsx>{`
                sup {
                    margin-left: 0.375rem;
                    color: ${colors.grey700};
                }
            `}</style>
        </sup>
    )
}

FootnoteRefs.propTypes = {
    cell: PropTypes.shape(),
}

export default FootnoteRefs
