import React from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { TableCellHead } from '@dhis2/ui'

import styles from './styles/RowControls.style'
import RowActions from './RowActions'

export function RowControls({ dispatch, row, idx, maxIdx }) {
    return (
        <TableCellHead>
            <div className="flex-container">
                {row.name}
                <RowActions
                    dispatch={dispatch}
                    row={row}
                    idx={idx}
                    maxIdx={maxIdx}
                />
            </div>
            <style jsx>{styles}</style>
        </TableCellHead>
    )
}

RowControls.propTypes = {
    dispatch: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
    maxIdx: PropTypes.number.isRequired,
    row: PropTypes.shape({ name: PropTypes.string }).isRequired,
}

export default RowControls
