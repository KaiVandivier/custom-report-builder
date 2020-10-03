import React, { useState } from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { MenuItem } from '@dhis2/ui'
import {
    DELETE_ROW,
    REORDER_ROW,
    UPDATE_ROW,
} from '../../reducers/tableReducer'
import i18n from '../../locales'

import Icon from '../../components/Icon'
import PopoverMenu from '../../components/PopoverMenu'
import ConfirmModal from '../../components/ConfirmModal'
import InputModal from '../../components/InputModal'

export function RowActions({ dispatch, name, idx, maxIdx }) {
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)

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

    function onEdit(togglePopover, inputText) {
        dispatch({
            type: UPDATE_ROW,
            payload: { idx, row: { name: inputText } },
        })
        togglePopover()
    }

    function onDelete(togglePopover) {
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
                        onClick={() => setEditModalIsOpen(true)}
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
                            text={i18n.t('Do you want to delete this row?')}
                            title={i18n.t('Confirm deletion')}
                            onCancel={() => setDeleteModalIsOpen(false)}
                            onConfirm={() => {
                                onDelete(togglePopover)
                                setDeleteModalIsOpen(false)
                            }}
                            destructive={true}
                        />
                    )}
                    {editModalIsOpen && (
                        <InputModal
                            title={i18n.t('Edit row')}
                            inputLabel={i18n.t('Row name')}
                            inputPlaceholder={i18n.t('Enter row name')}
                            confirmText={i18n.t('Save')}
                            onCancel={() => setEditModalIsOpen(false)}
                            onConfirm={inputText => {
                                onEdit(togglePopover, inputText)
                                setEditModalIsOpen(false)
                            }}
                            initialValue={name}
                        />
                    )}
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
