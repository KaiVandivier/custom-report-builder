import React, { useState } from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { MenuItem } from '@dhis2/ui'
import { DELETE_COLUMN, REORDER_COLUMN } from '../../reducers/tableReducer'
import i18n from '../../locales'

import Icon from '../../components/Icon'
import PopoverMenu from '../../components/PopoverMenu'
import ConfirmModal from '../../components/ConfirmModal'

// TODO: Rename 'Column actions'
export function ColumnActions({ dispatch, name, idx, maxIdx }) {
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

    function onMoveLeft(togglePopover) {
        if (idx <= 0) return
        dispatch({
            type: REORDER_COLUMN,
            payload: { oldIdx: idx, newIdx: idx - 1 },
        })
        togglePopover()
    }

    function onMoveRight(togglePopover) {
        if (idx >= maxIdx) return
        dispatch({
            type: REORDER_COLUMN,
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
            type: DELETE_COLUMN,
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
                        icon={<Icon name="arrow_left" dense />}
                        label={i18n.t('Move column left')}
                        onClick={() => onMoveLeft(togglePopover)}
                    />
                    <MenuItem
                        dense
                        disabled={idx >= maxIdx}
                        icon={<Icon name="arrow_right" dense />}
                        label={i18n.t('Move column right')}
                        onClick={() => onMoveRight(togglePopover)}
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
                        onClick={() => setDeleteModalIsOpen(true)}
                    />
                    {deleteModalIsOpen && (
                        <ConfirmModal
                            confirmText={i18n.t('Delete')}
                            text={i18n.t('Do you want to delete this column?')}
                            title={i18n.t('Confirm deletion')}
                            onCancel={() => setDeleteModalIsOpen(false)}
                            onConfirm={() => {
                                onDelete(togglePopover)
                                setDeleteModalIsOpen(false)
                            }}
                            destructive={true}
                        />
                    )}
                </>
            )}
        </PopoverMenu>
    )
}

ColumnActions.propTypes = {
    dispatch: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
    maxIdx: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
}

export default ColumnActions
