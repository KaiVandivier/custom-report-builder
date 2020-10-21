import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Divider } from '@dhis2/ui'
import i18n from '../../../../locales'

import { UPDATE_CELL } from '../../../../reducers/tableReducer'
import { dataTypes } from '../../../../modules/dataTypes'
import DataEngine from '../../../../components/DataEngine'
import { DataSelectorDialog } from './DataSelectorDialog'
import styles from './styles/ContentSelector.style'
import IconTooltipButton from '../../../../components/IconTooltipButton'
import OrgUnitSelectorDialog from './OrgUnitSelectorDialog'
import PeriodSelectorDialog from './PeriodSelectorDialog'

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
        setDataDialogOpen(false)

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
            <Divider />
            {data.item ? (
                <>
                    <div className="container" onClick={toggleDataDialog}>
                        <div>
                            <div className="header">{i18n.t('Data Item')}</div>
                            <p>{data.item.name}</p>
                            <div className="header">{i18n.t('Data Type')}</div>
                            <p>
                                {dataTypes[data.dataType]
                                    .getName()
                                    .replace(/s$/, '')}
                            </p>
                        </div>
                        <IconTooltipButton
                            icon="edit"
                            tooltip={i18n.t('Select data')}
                            size={'18px'}
                            onClick={toggleDataDialog}
                        />
                    </div>
                    <Divider />
                    <div className="container" onClick={toggleOrgUnitDialog}>
                        <div>
                            <div className="header">
                                {i18n.t('Org. Unit(s)')}
                            </div>
                            <p>
                                {data.orgUnits?.length ? (
                                    getSelectedNames(data.orgUnits)
                                ) : (
                                    <em>{i18n.t('None selected*')}</em>
                                )}
                            </p>
                        </div>
                        <IconTooltipButton
                            icon="edit"
                            tooltip={i18n.t('Select org. unit(s)')}
                            size={'18px'}
                            onClick={toggleOrgUnitDialog}
                        />
                    </div>
                    <Divider />
                    <div className="container" onClick={togglePeriodDialog}>
                        <div>
                            <div className="header">{i18n.t('Period(s)')}</div>
                            <p>
                                {data.periods?.length ? (
                                    getSelectedNames(data.periods)
                                ) : (
                                    <em>{i18n.t('None selected*')}</em>
                                )}
                            </p>
                        </div>
                        <IconTooltipButton
                            icon="edit"
                            tooltip={i18n.t('Select period(s)')}
                            size={'18px'}
                            onClick={togglePeriodDialog}
                        />
                    </div>
                </>
            ) : (
                <>
                    <p>{i18n.t('No data selected')}</p>
                    <Button small onClick={toggleDataDialog}>
                        {i18n.t('Choose data...')}
                    </Button>
                </>
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
            <style jsx>{styles}</style>
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
