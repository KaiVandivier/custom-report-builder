import React, { useState } from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { FlyoutMenu, MenuItem, TableCellHead } from '@dhis2/ui'
import {
    DELETE_COLUMN,
    REORDER_COLUMN,
    UPDATE_COLUMN,
    UPDATE_COLUMN_DIMENSIONS,
} from '../../../reducers/tableReducer'
import i18n from '../../../locales'

import Icon from '../../../components/Icon'
import PopoverButton from '../../../components/PopoverButton'
import ConfirmModal from '../../../components/ConfirmModal'
import InputModal from '../../../components/InputModal'
import DataEngine from '../../../components/DataEngine'
import {
    DataSelectorDialog,
    OrgUnitSelectorDialog,
    PeriodSelectorDialog,
} from './EditTableCell'
import styles from './styles/RowColumnControls.style'
import utils from '../../../styles/utils.module.css'
import SelectorFrame from './SelectorFrame'

function getSelectedNames(arr) {
    return arr.map(({ name }) => name).join(', ')
}

export function ColumnControls({ dispatch, col, idx, maxIdx }) {
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)

    const [dataDialogOpen, setDataDialogOpen] = useState(false)
    const [orgUnitDialogOpen, setOrgUnitDialogOpen] = useState(false)
    const [periodDialogOpen, setPeriodDialogOpen] = useState(false)

    const toggleDataDialog = () => setDataDialogOpen(state => !state)
    const toggleOrgUnitDialog = () => setOrgUnitDialogOpen(state => !state)
    const togglePeriodDialog = () => setPeriodDialogOpen(state => !state)

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

    function onDataDialogSave(data) {
        dispatch({
            type: UPDATE_COLUMN_DIMENSIONS,
            payload: {
                idx,
                dimensions: { ...data },
            },
        })
    }

    function onOrgUnitDialogSave(orgUnits) {
        dispatch({
            type: UPDATE_COLUMN_DIMENSIONS,
            payload: {
                idx,
                dimensions: { orgUnits },
            },
        })
    }

    function onPeriodDialogSave(periods) {
        dispatch({
            type: UPDATE_COLUMN_DIMENSIONS,
            payload: {
                idx,
                dimensions: { periods },
            },
        })
    }

    return (
        <TableCellHead className={utils.cell}>
            <div className="titleContainer">
                <span>{col.name}</span>
                <PopoverButton tooltip={i18n.t('Column actions')}>
                    {togglePopover => (
                        <FlyoutMenu>
                            <MenuItem
                                dense
                                icon={<Icon name="assignment" dense />}
                                label={i18n.t('Assign dimensions to column')}
                            >
                                <MenuItem
                                    dense
                                    label={i18n.t('Data Item')}
                                    onClick={() => {
                                        toggleDataDialog()
                                        togglePopover()
                                    }}
                                />
                                <MenuItem
                                    dense
                                    label={i18n.t('Organisation Unit(s)')}
                                    onClick={() => {
                                        toggleOrgUnitDialog()
                                        togglePopover()
                                    }}
                                />
                                <MenuItem
                                    dense
                                    label={i18n.t('Period(s)')}
                                    onClick={() => {
                                        togglePeriodDialog()
                                        togglePopover()
                                    }}
                                />
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
                                    text={i18n.t(
                                        'Do you want to delete this column?'
                                    )}
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
                                    inputPlaceholder={i18n.t(
                                        'Enter column name'
                                    )}
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
            </div>
            {col.dimensions?.item && (
                <SelectorFrame
                    title={i18n.t('Data item')}
                    content={col.dimensions.item.name}
                    tooltip={i18n.t('Select data item for column')}
                    onClick={toggleDataDialog}
                />
            )}
            {col.dimensions?.orgUnits?.length ? (
                <SelectorFrame
                    title={i18n.t('Organisation unit(s)')}
                    content={getSelectedNames(col.dimensions.orgUnits)}
                    tooltip={i18n.t('Select organisation unit(s) for column')}
                    onClick={toggleOrgUnitDialog}
                />
            ) : null}
            {col.dimensions?.periods?.length ? (
                <SelectorFrame
                    title={i18n.t('Period(s)')}
                    content={getSelectedNames(col.dimensions.periods)}
                    tooltip={i18n.t('Select period(s) for column')}
                    onClick={togglePeriodDialog}
                />
            ) : null}
            {dataDialogOpen && (
                <DataEngine>
                    {engine => (
                        <DataSelectorDialog
                            engine={engine}
                            onClose={toggleDataDialog}
                            onSave={onDataDialogSave}
                            initialValues={
                                col.dimensions?.item
                                    ? { ...col.dimensions }
                                    : {}
                            }
                        />
                    )}
                </DataEngine>
            )}
            <OrgUnitSelectorDialog
                open={orgUnitDialogOpen}
                currentlySelected={col.dimensions?.orgUnits}
                toggleModal={toggleOrgUnitDialog}
                onSave={onOrgUnitDialogSave}
            />
            <PeriodSelectorDialog
                open={periodDialogOpen}
                currentlySelected={col.dimensions?.periods}
                toggleModal={togglePeriodDialog}
                onSave={onPeriodDialogSave}
            />
            <style jsx>{styles}</style>
        </TableCellHead>
    )
}

ColumnControls.propTypes = {
    dispatch: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
    maxIdx: PropTypes.number.isRequired,
    col: PropTypes.shape({
        name: PropTypes.string.isRequired,
        dimensions: PropTypes.shape({
            dataType: PropTypes.string,
            group: PropTypes.string,
            groupDetail: PropTypes.string,
            item: PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
            }),
            orgUnits: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string,
                    name: PropTypes.string,
                })
            ),
            periods: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string,
                    name: PropTypes.string,
                })
            ),
        }),
    }),
}

export default ColumnControls
