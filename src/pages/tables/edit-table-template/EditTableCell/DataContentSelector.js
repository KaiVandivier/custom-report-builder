import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Divider } from '@dhis2/ui'
import i18n from '../../../../locales'

import { UPDATE_CELL } from '../../../../reducers/tableReducer'
import { dataTypes } from '../../../../modules/dataTypes'
import DataEngine from '../../../../components/DataEngine'
import DataSelectorModal from '../DataSelector/DataSelectorModal'
import styles from '../styles/DataContentSelector.style'
import IconTooltipButton from '../../../../components/IconTooltipButton'

export function DataContentSelector({ cell, dispatch, rowIdx, cellIdx }) {
    const [modalOpen, setModalOpen] = useState(false)

    const toggleModal = () => setModalOpen(state => !state)

    const onModalSave = ({ item, ...metadata }) => {
        setModalOpen(false)

        if (!item) return

        dispatch({
            type: UPDATE_CELL,
            payload: {
                cell: { data: { item, ...metadata } },
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
                        {/* <IconTooltipButton
                            icon="edit"
                            tooltip={i18n.t('Select data')}
                        /> */}
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
                            <p>{i18n.t('Same as table')}</p>
                        </div>
                        <IconTooltipButton
                            icon="edit"
                            tooltip={i18n.t('Select org. unit(s)')}
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
                <p>{i18n.t('No data selected')}</p>
            )}
            <Button small onClick={toggleModal}>
                {i18n.t('Choose data...')}
            </Button>
            {modalOpen && (
                <DataEngine>
                    {engine => (
                        <DataSelectorModal
                            engine={engine}
                            onClose={toggleModal}
                            onSave={onModalSave}
                            initialValues={data?.item ? { ...data } : {}}
                        />
                    )}
                </DataEngine>
            )}{' '}
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
        }),
        text: PropTypes.string,
    }),
}

export default DataContentSelector
