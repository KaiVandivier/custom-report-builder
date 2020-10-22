import React, { useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '../../../../locales'

import { UPDATE_CELL } from '../../../../reducers/tableReducer'
import DataEngine from '../../../../components/DataEngine'
import { DataSelectorDialog } from './DataSelectorDialog'
import OrgUnitSelectorDialog from './OrgUnitSelectorDialog'
import PeriodSelectorDialog from './PeriodSelectorDialog'
import SelectorFrame from '../SelectorFrame'

function getSelectedNames(arr) {
    return arr.map(({ name }) => name).join(', ')
}

export function DataContentSelector({ cell, dispatch, rowIdx, cellIdx }) {
    const [dataDialogOpen, setDataDialogOpen] = useState(false)
    const [orgUnitDialogOpen, setOrgUnitDialogOpen] = useState(false)
    const [periodDialogOpen, setPeriodDialogOpen] = useState(false)

    const toggleDataDialog = () => setDataDialogOpen(state => !state)
    const toggleOrgUnitDialog = () => setOrgUnitDialogOpen(state => !state)
    const togglePeriodDialog = () => setPeriodDialogOpen(state => !state)

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
                        <em>{i18n.t('None*')}</em>
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
                        <em>{i18n.t('None*')}</em>
                    )
                }
                tooltip={i18n.t('Select period(s)')}
                onClick={togglePeriodDialog}
            />
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
        </>
    )
}

DataContentSelector.propTypes = {
    cellIdx: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
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
        text: PropTypes.string,
    }),
}

export default DataContentSelector
