import React, { useState } from 'react'
import { TableCell, Button } from '@dhis2/ui'
import i18n from '../../locales'

import { DataSelectorModal } from './DataSelector/DataSelectorModal'
import DataEngine from '../../components/DataEngine'

// TODO: This will show the current cell contents and offer a dialog to define the data for a cell - the dialog will be another component I suppose

export const DataEntryCell = () => {
    const [modalOpen, setModalOpen] = useState(false)

    const onModalClose = () => setModalOpen(false)

    const onModalSave = args => {
        console.log(args)
        setModalOpen(false)
    }

    return (
        <TableCell>
            (Current data)
            <br />
            <Button primary onClick={() => setModalOpen(true)}>
                {i18n.t('Choose data...')}
            </Button>
            {modalOpen && (
                <DataEngine>
                    {engine => (
                        <DataSelectorModal
                            onClose={onModalClose}
                            onSave={onModalSave}
                            engine={engine}
                        />
                    )}
                </DataEngine>
            )}
        </TableCell>
    )
}
