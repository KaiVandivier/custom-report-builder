import React, { useState } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import i18n from '../../../../locales'

import { UPDATE_CELL } from '../../../../reducers/tableReducer'
import DataEngine from '../../../../components/DataEngine'
import { DataSelectorDialog } from './DataSelectorDialog'
import { OrgUnitSelectorDialog, PeriodSelectorDialog } from './index'
import SelectorFrame from '../SelectorFrame'
import {
    useTableDispatch,
    useTableState,
} from '../../../../context/tableContext'
import {
    getIntervalString,
    HighlightingEditorDialog,
} from '../HighlightingEditor'

function getSelectedNames(arr) {
    return arr.map(({ name }) => name).join(', ')
}

export function DataContentSelector({ cell, rowIdx, cellIdx }) {
    const table = useTableState()
    const dispatch = useTableDispatch()
    const [dataDialogOpen, setDataDialogOpen] = useState(false)
    const [orgUnitDialogOpen, setOrgUnitDialogOpen] = useState(false)
    const [periodDialogOpen, setPeriodDialogOpen] = useState(false)
    const [highlightingDialogOpen, setHighlightingDialogOpen] = useState(false)

    const toggleDataDialog = () => setDataDialogOpen(state => !state)
    const toggleOrgUnitDialog = () => setOrgUnitDialogOpen(state => !state)
    const togglePeriodDialog = () => setPeriodDialogOpen(state => !state)
    const toggleHighlightingDialog = () =>
        setHighlightingDialogOpen(state => !state)

    const onDataDialogSave = ({ item, ...metadata }) => {
        if (!item) return

        dispatch({
            type: UPDATE_CELL,
            payload: {
                cell: { data: { ...cell.data, item, ...metadata } },
                rowIdx,
                cellIdx,
            },
        })
    }

    const onOrgUnitDialogSave = orgUnits => {
        dispatch({
            type: UPDATE_CELL,
            payload: {
                cell: { data: { ...cell.data, orgUnits } },
                rowIdx,
                cellIdx,
            },
        })
    }

    const onPeriodDialogSave = periods => {
        dispatch({
            type: UPDATE_CELL,
            payload: {
                cell: { data: { ...cell.data, periods } },
                rowIdx,
                cellIdx,
            },
        })
    }

    const getHighlightingIntervals = () => {
        // Priority: cell > col > row > table
        return (
            cell.highlightingIntervals ||
            table.columns[cellIdx].highlightingIntervals ||
            table.rows[rowIdx].highlightingIntervals ||
            table.highlightingIntervals
        )
    }

    const getNextIntervalsAfterClear = () => {
        // Priority: col > row > null
        return (
            table.columns[cellIdx].highlightingIntervals ||
            table.rows[rowIdx].highlightingIntervals ||
            null
        )
    }

    const getHighlightingSelectorContent = () => {
        if (
            !cell.highlightingIntervals ||
            isEqual(cell.highlightingIntervals, table.highlightingIntervals)
        )
            return i18n.t('Same as table')
        if (
            isEqual(
                cell.highlightingIntervals,
                table.columns[cellIdx].highlightingIntervals
            )
        )
            return i18n.t('Same as column')
        if (
            isEqual(
                cell.highlightingIntervals,
                table.rows[rowIdx].highlightingIntervals
            )
        )
            return i18n.t('Same as row')
        return getIntervalString(cell.highlightingIntervals)
    }

    const onHighlightingDialogClear = () => {
        dispatch({
            type: UPDATE_CELL,
            payload: {
                cell: { highlightingIntervals: getNextIntervalsAfterClear() },
                rowIdx,
                cellIdx,
            },
        })
    }

    const onHighlightingDialogSave = intervals => {
        dispatch({
            type: UPDATE_CELL,
            payload: {
                cell: { highlightingIntervals: intervals },
                rowIdx,
                cellIdx,
            },
        })
    }

    const { data } = cell
    return (
        <>
            <SelectorFrame
                title={i18n.t('Data Item')}
                content={data.item ? data.item.name : <em>{i18n.t('None')}</em>}
                tooltip={i18n.t('Select data')}
                onClick={toggleDataDialog}
            />
            <SelectorFrame
                title={i18n.t('Organisation unit(s)')}
                content={
                    data.orgUnits?.length ? (
                        getSelectedNames(data.orgUnits)
                    ) : (
                        <em>{i18n.t('Select during generation')}</em>
                    )
                }
                tooltip={i18n.t('Select organisation unit(s)')}
                onClick={toggleOrgUnitDialog}
            />
            <SelectorFrame
                title={i18n.t('Period(s)')}
                content={
                    data.periods?.length ? (
                        getSelectedNames(data.periods)
                    ) : (
                        <em>{i18n.t('Select during generation')}</em>
                    )
                }
                tooltip={i18n.t('Select period(s)')}
                onClick={togglePeriodDialog}
            />
            {table.highlightingOn && (
                <SelectorFrame
                    title={i18n.t('Highlighting rules')}
                    content={getHighlightingSelectorContent()}
                    tooltip={i18n.t('Configure highlighting for cell')}
                    onClick={toggleHighlightingDialog}
                    onClear={onHighlightingDialogClear}
                />
            )}
            {dataDialogOpen && (
                <DataEngine>
                    {engine => (
                        <DataSelectorDialog
                            engine={engine}
                            onClose={toggleDataDialog}
                            onSave={onDataDialogSave}
                            initialValues={data?.item ? { ...data } : {}}
                        />
                    )}
                </DataEngine>
            )}
            <OrgUnitSelectorDialog
                open={orgUnitDialogOpen}
                currentlySelected={data.orgUnits}
                toggleModal={toggleOrgUnitDialog}
                onSave={onOrgUnitDialogSave}
            />
            <PeriodSelectorDialog
                open={periodDialogOpen}
                currentlySelected={data.periods}
                toggleModal={togglePeriodDialog}
                onSave={onPeriodDialogSave}
            />
            <HighlightingEditorDialog
                open={highlightingDialogOpen}
                toggle={toggleHighlightingDialog}
                helpText={i18n.t(
                    'Configure highlighting intervals for this cell'
                )}
                highlightingIntervals={getHighlightingIntervals()}
                onSave={onHighlightingDialogSave}
            />
        </>
    )
}

DataContentSelector.propTypes = {
    cellIdx: PropTypes.number.isRequired,
    rowIdx: PropTypes.number.isRequired,
    cell: PropTypes.shape({
        contentType: PropTypes.string,
        data: PropTypes.shape({
            dataType: PropTypes.string,
            groupDetail: PropTypes.string,
            groupId: PropTypes.string,
            item: PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
            }),
            orgUnits: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string,
                    name: PropTypes.string,
                    path: PropTypes.string,
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
        text: PropTypes.string,
    }),
}

export default DataContentSelector
