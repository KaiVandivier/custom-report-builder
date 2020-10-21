import React, { useState } from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { FlyoutMenu, MenuItem } from '@dhis2/ui'
import {
    DELETE_COLUMN,
    REORDER_COLUMN,
    UPDATE_COLUMN,
} from '../../../reducers/tableReducer'
import i18n from '../../../locales'

import Icon from '../../../components/Icon'
import PopoverButton from '../../../components/PopoverButton'
import ConfirmModal from '../../../components/ConfirmModal'
import InputModal from '../../../components/InputModal'

export function ColumnActions({ dispatch, col, idx, maxIdx }) {
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)

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

    function onEdit(togglePopover, inputText) {
        dispatch({
            type: UPDATE_COLUMN,
            payload: { idx, column: { name: inputText } },
        })
        togglePopover()
    }

    function onDelete(togglePopover) {
        dispatch({
            type: DELETE_COLUMN,
            payload: { idx },
        })
        togglePopover()
    }

    return (
        <PopoverButton tooltip={i18n.t('Column actions')}>
            {togglePopover => (
                <FlyoutMenu>
                    <MenuItem
                        dense
                        icon={<Icon name="assignment" dense />}
                        label={i18n.t('Assign dimensions to column')}
                        onClick={args => {
                            // TODO
                            console.log(args)
                            console.log('Assigning')
                        }}
                    >
                        <MenuItem dense label={i18n.t('Data Item')} />
                        <MenuItem
                            dense
                            label={i18n.t('Organisation Unit(s)')}
                        />
                        <MenuItem dense label={i18n.t('Period(s)')} />
                    </MenuItem>
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
                    {editModalIsOpen && (
                        <InputModal
                            title={i18n.t('Edit column')}
                            inputLabel={i18n.t('Column name')}
                            inputPlaceholder={i18n.t('Enter column name')}
                            confirmText={i18n.t('Save')}
                            onCancel={() => setEditModalIsOpen(false)}
                            onConfirm={inputText => {
                                onEdit(togglePopover, inputText)
                                setEditModalIsOpen(false)
                            }}
                            initialValue={col.name}
                        />
                    )}
                </FlyoutMenu>
            )}
        </PopoverButton>
    )
}

ColumnActions.propTypes = {
    dispatch: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
    maxIdx: PropTypes.number.isRequired,
    col: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }),
}

export default ColumnActions
