import React, { useState } from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { Button } from '@dhis2/ui'
import i18n from '../../../locales'
import { ADD_ROW, ADD_COLUMN } from '../../../reducers/tableReducer'
import Icon from '../../../components/Icon'
import InputDialog from '../../../components/InputDialog'

export function AddTableDimension({ dispatch, type }) {
    const [modalOpen, setModalOpen] = useState(false)

    const onCancel = () => setModalOpen(false)

    const onConfirm = inputText => {
        dispatch({
            type: type === 'Row' ? ADD_ROW : ADD_COLUMN,
            payload: { name: inputText },
        })
        setModalOpen(false)
    }

    const onOpen = () => {
        setModalOpen(true)
    }

    return (
        <>
            <Button icon={<Icon name="add" />} onClick={onOpen}>
                {i18n.t('Add {{type}}', { type })}
            </Button>
            {modalOpen && (
                <InputDialog
                    title={i18n.t('New {{type}}', { type })}
                    inputLabel={i18n.t('{{type}} Name', { type })}
                    inputPlaceholder={i18n.t('Enter a name')}
                    confirmText={i18n.t('Add {{type}}', { type })}
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                />
            )}
        </>
    )
}

AddTableDimension.propTypes = {
    dispatch: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['Row', 'Column']).isRequired,
}

export default AddTableDimension
