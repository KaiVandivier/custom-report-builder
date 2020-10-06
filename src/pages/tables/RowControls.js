import React from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { TableCellHead } from '@dhis2/ui'

import styles from './styles/RowControls.style'
import RowActions from './RowActions'

export function RowControls({ dispatch, name, idx, maxIdx }) {
    return (
        <TableCellHead>
            <div className="flex-container">
                {name}
                <RowActions
                    dispatch={dispatch}
                    name={name}
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
    name: PropTypes.string.isRequired,
}

export default RowControls
