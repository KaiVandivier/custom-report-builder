import React from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { TableCellHead } from '@dhis2/ui'

import styles from './styles/ColumnControls.style'
import ColumnActions from './ColumnActions'

export function ColumnControls({ dispatch, name, idx, maxIdx }) {
    return (
        <TableCellHead>
            <div className="container">
                <span>{name}</span>
                <ColumnActions
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

ColumnControls.propTypes = {
    dispatch: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
    maxIdx: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
}

export default ColumnControls
