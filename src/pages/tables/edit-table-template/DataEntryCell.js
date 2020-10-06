import React, { useState } from 'react'
import { TableCell, Button } from '@dhis2/ui'
import { PropTypes } from '@dhis2/prop-types'
import i18n from '../../../locales'

import { DataSelectorModal } from './DataSelector/DataSelectorModal'
import DataEngine from '../../../components/DataEngine'
import { dataTypes } from '../../../modules/dataTypes'
import { UPDATE_CELL } from '../../../reducers/tableReducer'

export const DataEntryCell = ({ values, dispatch, cellIdx, rowIdx }) => {
    const [modalOpen, setModalOpen] = useState(false)

    const onModalClose = () => setModalOpen(false)

    const onModalSave = ({ item, ...metadata }) => {
        setModalOpen(false)

        dispatch({
            type: UPDATE_CELL,
            payload: {
                cell: { item, ...metadata },
                rowIdx,
                cellIdx,
            },
        })
    }

    return (
        <TableCell>
            {values ? (
                <>
                    <p>
                        <strong>{i18n.t('Name:')}</strong> {values.item.name}
                    </p>
                    <p>
                        <strong>{i18n.t('Data Type:')}</strong>{' '}
                        {/* TODO: Shorten name if too long */}
                        {dataTypes[values.dataType].getName().replace(/s$/, '')}
                    </p>
                </>
            ) : (
                <p>{i18n.t('No data selected')}</p>
            )}
            <Button small onClick={() => setModalOpen(true)}>
                {i18n.t('Choose data...')}
            </Button>
            {modalOpen && (
                <DataEngine>
                    {engine => (
                        <DataSelectorModal
                            engine={engine}
                            onClose={onModalClose}
                            onSave={onModalSave}
                            initialValues={values?.item ? { ...values } : {}}
                        />
                    )}
                </DataEngine>
            )}
        </TableCell>
    )
}

DataEntryCell.propTypes = {
    cellIdx: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    rowIdx: PropTypes.number.isRequired,
    values: PropTypes.shape({
        dataType: PropTypes.string,
        groupDetail: PropTypes.string,
        groupId: PropTypes.string,
        item: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
    }),
}

export default DataEntryCell
