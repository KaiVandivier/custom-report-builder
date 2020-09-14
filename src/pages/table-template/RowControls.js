import React from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { Button, TableCellHead } from '@dhis2/ui'
import { DELETE_ROW, REORDER_ROW } from '../../reducers/tableReducer'
import i18n from '../../locales'

import styles from './styles/RowControls.style'

export function RowControls({ dispatch, name, idx, maxIdx }) {
    function onMoveUp() {
        if (idx <= 0) return
        dispatch({
            type: REORDER_ROW,
            payload: { oldIdx: idx, newIdx: idx - 1 },
        })
    }

    function onMoveDown() {
        if (idx >= maxIdx) return
        dispatch({
            type: REORDER_ROW,
            payload: { oldIdx: idx, newIdx: idx + 1 },
        })
    }

    function onEdit() {
        // TODO: open a modal and offer to edit
    }

    function onDelete() {
        // TODO: open modal to confirm deletion
        dispatch({
            type: DELETE_ROW,
            payload: { idx },
        })
    }

    return (
        <TableCellHead>
            <div className="flex-container">
                {name}
                <div className="button-container">
                    <Button small onClick={onMoveUp}>
                        {i18n.t('Move up')}
                    </Button>
                    <Button small onClick={onEdit}>
                        {i18n.t('Edit')}
                    </Button>
                    <Button small destructive onClick={onDelete}>
                        {i18n.t('Delete')}
                    </Button>
                    <Button small onClick={onMoveDown}>
                        {i18n.t('Move down')}
                    </Button>
                    {/* Move up: idx > 0 && <ReorderTableDimension label="Move up" oldIdx={idx} newIdx={idx - 1} /> */}
                    {/* Edit: <EditTableDimension */}
                    {/* Delete: <DeleteTableDimension */}
                    {/* Move down: idx < maxIdx && <ReordeTableDimension label="Move down" oldIdx={idx} newIdx={idx + 1} /> */}
                </div>
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
