import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Divider } from '@dhis2/ui'
import i18n from '../../../locales'

import { UPDATE_CELL } from '../../../reducers/tableReducer'
import { dataTypes } from '../../../modules/dataTypes'
import DataEngine from '../../../components/DataEngine'
import DataSelectorModal from './DataSelector/DataSelectorModal'

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
                    <p>
                        <strong>{i18n.t('Name:')}</strong> {data.item.name}
                    </p>
                    <p>
                        <strong>{i18n.t('Data Type:')}</strong>{' '}
                        {/* TODO: Shorten name if too long */}
                        {dataTypes[data.dataType].getName().replace(/s$/, '')}
                    </p>
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
