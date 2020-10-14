import React from 'react'
import { TableCell } from '@dhis2/ui'
import PropTypes from 'prop-types'
import CellData from './CellData'

export function GeneratedTableCell({
    cell,
    selectedOrgUnits,
    selectedPeriods,
}) {
    // TODO: Tooltips
    function getCellContents() {
        if (!cell) return null
        switch (cell.contentType) {
            case 'text':
                return <span>{cell.text}</span>
            case 'data':
                return (
                    <CellData
                        cell={cell}
                        selectedOrgUnits={selectedOrgUnits}
                        selectedPeriods={selectedPeriods}
                    />
                )
            default:
                // TODO: This should only be for proper data cells
                return (
                    <CellData
                        cell={cell}
                        selectedOrgUnits={selectedOrgUnits}
                        selectedPeriods={selectedPeriods}
                    />
                )
            // break
        }
    }

    return <TableCell>{getCellContents()}</TableCell>
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
