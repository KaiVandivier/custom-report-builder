import React, { useState } from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { Divider, FlyoutMenu, MenuItem, TableCellHead } from '@dhis2/ui'
import {
    DELETE_ROW,
    REORDER_ROW,
    UPDATE_ROW,
    UPDATE_ROW_DIMENSIONS,
    UPDATE_ROW_HIGHLIGHTING,
    DELETE_COLUMN,
    REORDER_COLUMN,
    UPDATE_COLUMN,
    UPDATE_COLUMN_DIMENSIONS,
    UPDATE_COLUMN_HIGHLIGHTING,
} from '../../../reducers/tableReducer'
import cx from 'classnames'
import i18n from '../../../locales'

import Icon from '../../../components/Icon'
import PopoverButton from '../../../components/PopoverButton'
import ConfirmModal from '../../../components/ConfirmModal'
import InputDialog from '../../../components/InputDialog'
import DataEngine from '../../../components/DataEngine'
import {
    DataSelectorDialog,
    OrgUnitSelectorDialog,
    PeriodSelectorDialog,
} from './EditTableCell'
import styles from './styles/RowColumnControls.style'
import utils from '../../../styles/utils.module.css'
import SelectorFrame from './SelectorFrame'
import { useTableDispatch, useTableState } from '../../../context/tableContext'
import {
    getIntervalString,
    HighlightingEditorDialog,
} from './HighlightingEditor'

const ROW = 'row'
const COL = 'column'

const rowColTypes = {
    [ROW]: {
        id: ROW,
        nameLower: 'row',
        nameUpper: 'Row',
        actions: {
            delete: DELETE_ROW,
            reorder: REORDER_ROW,
            update: UPDATE_ROW,
            updateDimensions: UPDATE_ROW_DIMENSIONS,
            updateHighlighting: UPDATE_ROW_HIGHLIGHTING,
        },
        decrementPosition: {
            icon: 'arrow_drop_up',
            getLabel: () => i18n.t('Move row up'),
        },
        incrementPosition: {
            icon: 'arrow_drop_down',
            getLabel: () => i18n.t('Move row down'),
        },
    },
    [COL]: {
        id: COL,
        nameLower: 'column',
        nameUpper: 'Column',
        actions: {
            delete: DELETE_COLUMN,
            reorder: REORDER_COLUMN,
            update: UPDATE_COLUMN,
            updateDimensions: UPDATE_COLUMN_DIMENSIONS,
            updateHighlighting: UPDATE_COLUMN_HIGHLIGHTING,
        },
        decrementPosition: {
            icon: 'arrow_left',
            getLabel: () => i18n.t('Move column left'),
        },
        incrementPosition: {
            icon: 'arrow_right',
            getLabel: () => i18n.t('Move column right'),
        },
    },
}

function getSelectedNames(arr) {
    return arr.map(({ name }) => name).join(', ')
}

export function RowColControls({ type = ROW, rowColObj, idx, maxIdx }) {
    const dispatch = useTableDispatch()
    const table = useTableState()

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [dataDialogOpen, setDataDialogOpen] = useState(false)
    const [orgUnitDialogOpen, setOrgUnitDialogOpen] = useState(false)
    const [periodDialogOpen, setPeriodDialogOpen] = useState(false)
    const [highlightingDialogOpen, setHighlightingDialogOpen] = useState(false)

    const toggleDeleteDialog = () => setDeleteDialogOpen(state => !state)
    const toggleEditDialog = () => setEditDialogOpen(state => !state)
    const toggleDataDialog = () => setDataDialogOpen(state => !state)
    const toggleOrgUnitDialog = () => setOrgUnitDialogOpen(state => !state)
    const togglePeriodDialog = () => setPeriodDialogOpen(state => !state)
    const toggleHighlightingDialog = () =>
        setHighlightingDialogOpen(state => !state)

    function onMoveUp() {
        if (idx <= 0) return
        dispatch({
            type: rowColTypes[type].actions.reorder,
            payload: { oldIdx: idx, newIdx: idx - 1 },
        })
    }

    function onMoveDown() {
        if (idx >= maxIdx) return
        dispatch({
            type: rowColTypes[type].actions.reorder,
            payload: { oldIdx: idx, newIdx: idx + 1 },
        })
    }

    function onEdit(inputText) {
        toggleEditDialog()
        dispatch({
            type: rowColTypes[type].actions.update,
            payload: { idx, [rowColTypes[type].id]: { name: inputText } },
        })
    }

    function onDelete() {
        toggleDeleteDialog()
        dispatch({
            type: rowColTypes[type].actions.delete,
            payload: { idx },
        })
    }

    function onDataDialogSave(data) {
        dispatch({
            type: rowColTypes[type].actions.updateDimensions,
            payload: {
                idx,
                dimensions: { ...data },
            },
        })
    }

    function onDataSelectorClear() {
        dispatch({
            type: rowColTypes[type].actions.updateDimensions,
            payload: {
                idx,
                dimensions: { item: null },
            },
        })
    }

    function onOrgUnitDialogSave(orgUnits) {
        dispatch({
            type: rowColTypes[type].actions.updateDimensions,
            payload: {
                idx,
                dimensions: { orgUnits },
            },
        })
    }

    function onPeriodDialogSave(periods) {
        dispatch({
            type: rowColTypes[type].actions.updateDimensions,
            payload: {
                idx,
                dimensions: { periods },
            },
        })
    }

    function onHighlightingDialogSave(highlightingIntervals) {
        dispatch({
            type: rowColTypes[type].actions.updateHighlighting,
            payload: { idx, highlightingIntervals },
        })
    }

    function onHighlightingClear() {
        dispatch({
            type: rowColTypes[type].actions.updateHighlighting,
            payload: { idx, highlightingIntervals: null },
        })
    }

    function flyoutMenu(togglePopover) {
        return (
            <FlyoutMenu>
                <MenuItem
                    dense
                    icon={<Icon name="assignment" dense />}
                    label={i18n.t('Assign dimensions to {{name}}', {
                        name: rowColTypes[type].nameLower,
                    })}
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
                    icon={
                        <Icon
                            name={rowColTypes[type].decrementPosition.icon}
                            dense
                        />
                    }
                    label={rowColTypes[type].decrementPosition.getLabel()}
                    onClick={() => {
                        onMoveUp()
                        togglePopover()
                    }}
                />
                <MenuItem
                    dense
                    disabled={idx >= maxIdx}
                    icon={
                        <Icon
                            name={rowColTypes[type].incrementPosition.icon}
                            dense
                        />
                    }
                    label={rowColTypes[type].incrementPosition.getLabel()}
                    onClick={() => {
                        onMoveDown()
                        togglePopover()
                    }}
                />
                <MenuItem
                    dense
                    icon={<Icon name="border_color" dense />}
                    label={i18n.t('Configure highlighting for {{name}}', {
                        name: rowColTypes[type].nameLower,
                    })}
                    onClick={() => {
                        toggleHighlightingDialog()
                        togglePopover()
                    }}
                />
                <MenuItem
                    dense
                    icon={<Icon name="edit" dense />}
                    label={i18n.t('Edit')}
                    onClick={() => {
                        toggleEditDialog()
                        togglePopover()
                    }}
                />
                <MenuItem
                    dense
                    icon={<Icon name="delete" dense />}
                    label={i18n.t('Delete')}
                    onClick={() => {
                        toggleDeleteDialog()
                        togglePopover()
                    }}
                />
            </FlyoutMenu>
        )
    }

    return (
        <TableCellHead className={utils.cell}>
            <div className={cx('titleContainer', { rowTitle: type === ROW })}>
                {rowColObj.name}
                <PopoverButton
                    tooltip={i18n.t('{{name}} actions', {
                        name: rowColTypes[type].nameUpper,
                    })}
                >
                    {flyoutMenu}
                </PopoverButton>
            </div>

            {/* Selector frames */}

            {(rowColObj.dimensions?.item ||
                rowColObj.dimensions?.periods?.length ||
                rowColObj.dimensions?.orgUnits?.length ||
                rowColObj.highlightingIntervals) && <Divider />}
            {rowColObj.dimensions?.item && (
                <SelectorFrame
                    title={i18n.t('Data item')}
                    content={rowColObj.dimensions.item.name}
                    tooltip={i18n.t('Select data item for {{name}}', {
                        name: rowColTypes[type].nameLower,
                    })}
                    onClick={toggleDataDialog}
                    onClear={onDataSelectorClear}
                />
            )}
            {rowColObj.dimensions?.orgUnits?.length > 0 && (
                <SelectorFrame
                    title={i18n.t('Organisation unit(s)')}
                    content={getSelectedNames(rowColObj.dimensions.orgUnits)}
                    tooltip={i18n.t(
                        'Select organisation unit(s) for {{name}}',
                        {
                            name: rowColTypes[type].nameLower,
                        }
                    )}
                    onClick={toggleOrgUnitDialog}
                />
            )}
            {rowColObj.dimensions?.periods?.length > 0 && (
                <SelectorFrame
                    title={i18n.t('Period(s)')}
                    content={getSelectedNames(rowColObj.dimensions.periods)}
                    tooltip={i18n.t('Select period(s)')}
                    onClick={togglePeriodDialog}
                />
            )}
            {table.highlightingOn && rowColObj.highlightingIntervals && (
                <SelectorFrame
                    title={i18n.t('Highlighting rules')}
                    content={getIntervalString(rowColObj.highlightingIntervals)}
                    tooltip={i18n.t('Configure highlighting for {{name}}', {
                        name: rowColTypes[type].nameLower,
                    })}
                    onClick={toggleHighlightingDialog}
                    onClear={onHighlightingClear}
                />
            )}

            {/* Dialogs */}

            {deleteDialogOpen && (
                <ConfirmModal
                    confirmText={i18n.t('Delete')}
                    text={i18n.t('Do you want to delete this {{name}}?', {
                        name: rowColTypes[type].nameLower,
                    })}
                    title={i18n.t('Confirm deletion')}
                    onCancel={toggleDeleteDialog}
                    onConfirm={onDelete}
                    destructive={true}
                />
            )}
            {editDialogOpen && (
                <InputDialog
                    title={i18n.t('Edit {{ name }}', {
                        name: rowColTypes[type].nameLower,
                    })}
                    inputLabel={i18n.t('{{name}} name', {
                        name: rowColTypes[type].nameUpper,
                    })}
                    inputPlaceholder={i18n.t('Enter {{name}} name', {
                        name: rowColTypes[type].nameLower,
                    })}
                    confirmText={i18n.t('Save')}
                    onCancel={toggleEditDialog}
                    onConfirm={onEdit}
                    initialValue={rowColObj.name}
                />
            )}
            {dataDialogOpen && (
                <DataEngine>
                    {engine => (
                        <DataSelectorDialog
                            engine={engine}
                            onClose={toggleDataDialog}
                            onSave={onDataDialogSave}
                            initialValues={
                                rowColObj.dimensions?.item
                                    ? { ...rowColObj.dimensions }
                                    : {}
                            }
                        />
                    )}
                </DataEngine>
            )}
            <OrgUnitSelectorDialog
                open={orgUnitDialogOpen}
                currentlySelected={rowColObj.dimensions?.orgUnits}
                toggleModal={toggleOrgUnitDialog}
                onSave={onOrgUnitDialogSave}
            />
            <PeriodSelectorDialog
                open={periodDialogOpen}
                currentlySelected={rowColObj.dimensions?.periods}
                toggleModal={togglePeriodDialog}
                onSave={onPeriodDialogSave}
            />
            <HighlightingEditorDialog
                open={highlightingDialogOpen}
                toggle={toggleHighlightingDialog}
                helpText={i18n.t(
                    'Configure highlighting intervals for this {{name}}. Highlighting for each cell can be configured independently thereafter.',
                    { name: rowColTypes[type].nameLower }
                )}
                highlightingIntervals={
                    rowColObj.highlightingIntervals ||
                    table.highlightingIntervals
                }
                onSave={onHighlightingDialogSave}
            />
            <style jsx>{styles}</style>
        </TableCellHead>
    )
}

RowColControls.propTypes = {
    idx: PropTypes.number.isRequired,
    maxIdx: PropTypes.number.isRequired,
    type: PropTypes.oneOf([ROW, COL]).isRequired,
    rowColObj: PropTypes.shape({
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
        highlightingIntervals: PropTypes.array,
    }),
}

export default RowColControls
