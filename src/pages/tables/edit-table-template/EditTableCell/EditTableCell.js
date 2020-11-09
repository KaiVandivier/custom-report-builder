import React from 'react'
import { Divider, TableCell } from '@dhis2/ui'
import { PropTypes } from '@dhis2/prop-types'

import { UPDATE_CELL } from '../../../../reducers/tableReducer'
import { DATA, TEXT, EMPTY } from '../../../../modules/contentTypes'
import utils from '../../../../styles/utils.module.css'
import ContentTypeSelector from './ContentTypeSelector'
import TextContentSelector from './TextContentSelector'
import DataContentSelector from './DataContentSelector'
import { useTableDispatch } from '../../../../context/tableContext'

export const EditTableCell = ({ cell, cellIdx, rowIdx }) => {
    const dispatch = useTableDispatch()

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

    const onTextContentChange = text =>
        dispatch({
            type: UPDATE_CELL,
            payload: {
                cell: { text },
                rowIdx,
                cellIdx,
            },
        })

    const getContentSelectorByType = () => {
        // TODO: could be a '.get()' function on contentTypes
        // TODO: Refactor these to use same props?
        switch (cell.contentType) {
            case DATA: {
                return (
                    <DataContentSelector
                        cell={cell}
                        rowIdx={rowIdx}
                        cellIdx={cellIdx}
                    />
                )
            }
            case TEXT:
                return (
                    <TextContentSelector
                        text={cell.text || ''}
                        onChange={onTextContentChange}
                    />
                )
            case EMPTY:
            default:
                return null
        }
    }

    return (
        <TableCell className={utils.cell}>
            <ContentTypeSelector
                currentContentType={cell.contentType || EMPTY}
                onChange={onContentTypeChange}
            />
            {cell.contentType !== EMPTY && <Divider />}
            {getContentSelectorByType()}
        </TableCell>
    )
}

EditTableCell.propTypes = {
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
        }),
        text: PropTypes.string,
    }),
}

export default EditTableCell
