import React from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { MenuItem } from '@dhis2/ui'
import { DELETE_ROW, REORDER_ROW } from '../../reducers/tableReducer'
import i18n from '../../locales'

import Icon from '../../components/Icon'
import PopoverMenu from '../../components/PopoverMenu'

export function RowActions({ dispatch, name, idx, maxIdx }) {
    function onMoveUp(togglePopover) {
        if (idx <= 0) return
        dispatch({
            type: REORDER_ROW,
            payload: { oldIdx: idx, newIdx: idx - 1 },
        })
        togglePopover()
    }

    function onMoveDown(togglePopover) {
        if (idx >= maxIdx) return
        dispatch({
            type: REORDER_ROW,
            payload: { oldIdx: idx, newIdx: idx + 1 },
        })
        togglePopover()
    }

    function onEdit(togglePopover) {
        // TODO: open a modal and offer to edit
        console.log(name)
        togglePopover()
    }

    function onDelete(togglePopover) {
        // TODO: open modal to confirm deletion
        dispatch({
            type: DELETE_ROW,
            payload: { idx },
        })
        togglePopover()
    }

    return (
        <PopoverMenu>
            {togglePopover => (
                <>
                    <MenuItem
                        dense
                        disabled={idx <= 0}
                        icon={<Icon name="arrow_drop_up" dense />}
                        label={i18n.t('Move row up')}
                        onClick={() => onMoveUp(togglePopover)}
                    />
                    <MenuItem
                        dense
                        disabled={idx >= maxIdx}
                        icon={<Icon name="arrow_drop_down" dense />}
                        label={i18n.t('Move row down')}
                        onClick={() => onMoveDown(togglePopover)}
                    />
                    <MenuItem
                        dense
                        icon={<Icon name="edit" dense />}
                        label={i18n.t('Edit')}
                        onClick={() => onEdit(togglePopover)}
                    />
                    <MenuItem
                        dense
                        icon={<Icon name="delete" dense />}
                        label={i18n.t('Delete')}
                        onClick={() => onDelete(togglePopover)}
                    />
                </>
            )}
        </PopoverMenu>
    )
}

RowActions.propTypes = {
    dispatch: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
    maxIdx: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
}

export default RowActions
