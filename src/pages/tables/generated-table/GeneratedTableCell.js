import React from 'react'
import { TableCell } from '@dhis2/ui'
import PropTypes from 'prop-types'
import CellData from './CellData'
import { DATA, TEXT, EMPTY } from '../../../modules/contentTypes'

export function GeneratedTableCell({
    cell,
    selectedOrgUnits,
    selectedPeriods,
}) {
    function getCellContents() {
        if (!cell) return null
        switch (cell.contentType) {
            case DATA:
                return (
                    <CellData
                        cell={cell}
                        selectedOrgUnits={selectedOrgUnits}
                        selectedPeriods={selectedPeriods}
                    />
                )
            case TEXT:
                return <span>{cell.text}</span>
            case EMPTY:
            default:
                return null
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
