import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Divider } from '@dhis2/ui'
import i18n from '../../../../locales'

import { UPDATE_CELL } from '../../../../reducers/tableReducer'
import { dataTypes } from '../../../../modules/dataTypes'
import DataEngine from '../../../../components/DataEngine'
import { DataSelectorModal } from './DataSelectorModal'
import styles from './styles/DataContentSelector.style'
import IconTooltipButton from '../../../../components/IconTooltipButton'
import OrgUnitSelectorDialog from '../OrgUnitSelectorDialog'

// TODO: Handle styles; make DRY

function getSelectedNames(arr) {
    return arr.map(({ name }) => name).join(', ')
}

export function DataContentSelector({ cell, dispatch, rowIdx, cellIdx }) {
    const [dataDialogOpen, setDataDialogOpen] = useState(false)
    const [orgUnitDialogOpen, setOrgUnitDialogOpen] = useState(false)
    // const [peDialogOpen, setPeDialogOpen] = useState(false)

    const toggleDataDialog = () => setDataDialogOpen(state => !state)
    const toggleOrgUnitDialog = () => setOrgUnitDialogOpen(state => !state)
    // const togglePeDialog = () => setPeDialogOpen(state => !state)

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

    // const onPeDialogSave = periods => {
    //     dispatch({
    //         type: UPDATE_CELL,
    //         payload: {
    //             cell: { data: { ...cell.data, periods } },
    //         },
    //     })
    // }

    const { data } = cell
    return (
        <>
            <Divider />
            {data.item ? (
                <>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <div className="header">{i18n.t('Name')}</div>
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
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <div className="header">
                                {i18n.t('Org. Unit(s)')}
                            </div>
                            <p>
                                {data.orgUnits?.length
                                    ? getSelectedNames(data.orgUnits)
                                    : i18n.t('Same as table')}
                            </p>
                        </div>
                        <IconTooltipButton
                            icon="edit"
                            tooltip={i18n.t('Select org. unit(s)')}
                            onClick={toggleOrgUnitDialog}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <div className="header">{i18n.t('Period(s)')}</div>
                            <p>{i18n.t('Same as table')}</p>
                        </div>
                        <IconTooltipButton
                            icon="edit"
                            tooltip={i18n.t('Select period(s)')}
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
                        <DataSelectorModal
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
                currentlySelected={cell.data.orgUnits}
                toggleModal={toggleOrgUnitDialog}
                onSave={onOrgUnitDialogSave}
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
        }),
        text: PropTypes.string,
    }),
}

export default DataContentSelector
