import React, { useState } from 'react'
import { TableCell, Button } from '@dhis2/ui'
import i18n from '../../locales'

import { DataSelectorModal } from './DataSelector/DataSelectorModal'
import DataEngine from '../../components/DataEngine'
import { dataTypes } from '../../modules/dataTypes'

export const DataEntryCell = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [dimensionItem, setDimensionItem] = useState(null)
    const [metadata, setMetadata] = useState({})

    const onModalClose = () => setModalOpen(false)

    const onModalSave = ({ item, ...metadata }) => {
        setDimensionItem({ item, ...metadata })
        setMetadata(metadata)
        setModalOpen(false)
    }

    return (
        <TableCell>
            {dimensionItem ? (
                <>
                    <p>
                        <strong>{i18n.t('Data Type:')}</strong>{' '}
                        {dataTypes[metadata.dataType].getName()}
                        {/* TODO: Shorten name if too long */}
                    </p>
                    <p>
                        <strong>{i18n.t('Name:')}</strong>{' '}
                        {dimensionItem.item.name}
                    </p>
                </>
            ) : (
                <p>{i18n.t('No data selected')}</p>
            )}
            <Button primary onClick={() => setModalOpen(true)}>
                {i18n.t('Choose data...')}
            </Button>
            {modalOpen && (
                <DataEngine>
                    {engine => (
                        <DataSelectorModal
                            engine={engine}
                            onClose={onModalClose}
                            onSave={onModalSave}
                            initialValues={
                                dimensionItem ? { ...dimensionItem } : {}
                            }
                        />
                    )}
                </DataEngine>
            )}
        </TableCell>
    )
}
