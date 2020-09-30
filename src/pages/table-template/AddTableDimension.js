import React, { useState } from 'react'
import { PropTypes } from '@dhis2/prop-types'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    InputField,
    Button,
    ButtonStrip,
} from '@dhis2/ui'
import i18n from '../../locales'
import { ADD_ROW, ADD_COLUMN } from '../../reducers/tableReducer'

export function AddTableDimension({ dispatch, type }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [name, setName] = useState('')

    const onCancel = () => setModalOpen(false)

    const onConfirm = () => {
        dispatch({
            type: type === 'Row' ? ADD_ROW : ADD_COLUMN,
            payload: { name },
        })
        setModalOpen(false)
    }

    const onOpen = () => {
        setModalOpen(true)
        setName('')
    }

    return (
        <>
            <Button onClick={onOpen}>{i18n.t('Add {{type}}', { type })}</Button>
            {modalOpen && (
                <Modal>
                    <ModalTitle>{i18n.t('New {{type}}', { type })}</ModalTitle>
                    <ModalContent>
                        <InputField
                            label={i18n.t('{{type}} Name', { type })}
                            name="name"
                            placeholder={i18n.t('Enter a name')}
                            onChange={ref => setName(ref.value)}
                            value={name}
                        />
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button onClick={onCancel}>
                                {i18n.t('Cancel')}
                            </Button>
                            <Button primary onClick={onConfirm}>
                                {i18n.t('Add {{type}}', { type })}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    )
}

AddTableDimension.propTypes = {
    dispatch: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['Row', 'Column']).isRequired,
}

export default AddTableDimension
