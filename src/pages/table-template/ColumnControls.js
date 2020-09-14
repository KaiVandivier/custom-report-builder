import React from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { Button, TableCellHead } from '@dhis2/ui'
import { DELETE_COLUMN, REORDER_COLUMN } from '../../reducers/tableReducer'
import i18n from '../../locales'

import styles from './styles/ColumnControls.style'

export function ColumnControls({ dispatch, name, idx, maxIdx }) {
    function onMoveLeft() {
        if (idx <= 0) return
        dispatch({
            type: REORDER_COLUMN,
            payload: { oldIdx: idx, newIdx: idx - 1 },
        })
    }

    function onMoveRight() {
        if (idx >= maxIdx) return
        dispatch({
            type: REORDER_COLUMN,
            payload: { oldIdx: idx, newIdx: idx + 1 },
        })
    }

    function onEdit() {
        // TODO: open a modal and offer to edit
    }

    function onDelete() {
        // TODO: open modal to confirm deletion
        dispatch({
            type: DELETE_COLUMN,
            payload: { idx },
        })
    }

    return (
        <TableCellHead>
            {name}
            <div className="button-container">
                <Button small onClick={onMoveLeft}>
                    {i18n.t('Move left')}
                </Button>
                <Button small onClick={onEdit}>
                    {i18n.t('Edit')}
                </Button>
                <Button small destructive onClick={onDelete}>
                    {i18n.t('Delete')}
                </Button>
                <Button small onClick={onMoveRight}>
                    {i18n.t('Move right')}
                </Button>
                {/* Move up: idx > 0 && <ReorderTableDimension label="Move up" oldIdx={idx} newIdx={idx - 1} /> */}
                {/* Edit: <EditTableDimension */}
                {/* Delete: <DeleteTableDimension */}
                {/* Move down: idx < maxIdx && <ReordeTableDimension label="Move down" oldIdx={idx} newIdx={idx + 1} /> */}
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
