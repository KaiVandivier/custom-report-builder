import React, { useState } from 'react'
import { TableCell, Button, Divider } from '@dhis2/ui'
import { PropTypes } from '@dhis2/prop-types'
import i18n from '../../../locales'

import { UPDATE_CELL } from '../../../reducers/tableReducer'
import { dataTypes } from '../../../modules/dataTypes'
import { DATA, TEXT, EMPTY } from '../../../modules/contentTypes'
import DataEngine from '../../../components/DataEngine'
import DataSelectorModal from './DataSelector/DataSelectorModal'
import ContentTypeSelector from './ContentTypeSelector'
import TextContentSelector from './TextContentSelector'

export const DataEntryCell = ({ cell, dispatch, cellIdx, rowIdx }) => {
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

    const onContentTypeChange = contentType => {
        dispatch({
            type: UPDATE_CELL,
            payload: {
                cell: { contentType },
                rowIdx,
                cellIdx,
            },
        })
    }

    const getContentSelectorByType = () => {
        // TODO: could be a '.get()' function on contentTypes
        // TODO: Refactor these into smaller, bite-size pieces
        switch (cell.contentType) {
            case DATA: {
                const { data } = cell
                return (
                    <>
                        <Divider />
                        {data.item ? (
                            <>
                                <p>
                                    <strong>{i18n.t('Name:')}</strong>{' '}
                                    {data.item.name}
                                </p>
                                <p>
                                    <strong>{i18n.t('Data Type:')}</strong>{' '}
                                    {/* TODO: Shorten name if too long */}
                                    {dataTypes[data.dataType]
                                        .getName()
                                        .replace(/s$/, '')}
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
                                        initialValues={
                                            data?.item ? { ...data } : {}
                                        }
                                    />
                                )}
                            </DataEngine>
                        )}{' '}
                    </>
                )
            }
            case TEXT:
                return (
                    <TextContentSelector
                        text={cell.text || ''}
                        onChange={text =>
                            dispatch({
                                type: UPDATE_CELL,
                                payload: {
                                    cell: { text },
                                    rowIdx,
                                    cellIdx,
                                },
                            })
                        }
                    />
                )
            case EMPTY:
            default:
                return null
        }
    }

    // TODO: Handle different cell content types
    return (
        <TableCell>
            {cell && (
                <ContentTypeSelector
                    currentContentType={cell.contentType || EMPTY}
                    onChange={onContentTypeChange}
                />
            )}
            {cell && getContentSelectorByType()}
        </TableCell>
    )
}

DataEntryCell.propTypes = {
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

export default DataEntryCell
