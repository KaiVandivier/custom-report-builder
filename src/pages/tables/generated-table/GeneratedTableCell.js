import React, { useState } from 'react'
import { TableCell } from '@dhis2/ui'
import PropTypes from 'prop-types'
import CellData from './CellData'
import { DATA, TEXT, EMPTY } from '../../../modules/contentTypes'
import { useTableState } from '../../../context/tableContext'

function getColor(intervals, value) {
    for (const { lowerBound, color } of intervals) {
        if (Number(value) >= Number(lowerBound)) return color
    }
}

export function GeneratedTableCell({
    cell,
    selectedOrgUnits,
    selectedPeriods,
}) {
    const [cellColor, setCellColor] = useState()
    const table = useTableState()

    function onLoad(value) {
        if (table.highlightingOn) {
            const color = getColor(
                cell.highlightingIntervals || table.highlightingIntervals,
                value
            )
            setCellColor(color)
        }
    }

    function getCellContents() {
        if (!cell) return null
        switch (cell.contentType) {
            case DATA:
                return (
                    <CellData
                        cell={cell}
                        selectedOrgUnits={selectedOrgUnits}
                        selectedPeriods={selectedPeriods}
                        onLoad={onLoad}
                    />
                )
            case TEXT:
                return <span>{cell.text}</span>
            case EMPTY:
            default:
                return null
        }
    }

    return (
        <TableCell>
            <div>
                {getCellContents()}
                <style jsx>{`
                    div {
                        display: inline-block;
                        padding: 0.5rem;
                        margin: -0.5rem;
                        background-color: ${cellColor};
                    }
                `}</style>
            </div>
        </TableCell>
    )
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
