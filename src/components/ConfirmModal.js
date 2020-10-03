import React from 'react'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../locales'

function ConfirmModal({
    confirmText,
    text,
    title,
    onCancel,
    onConfirm,
    destructive,
}) {
    return (
        <Modal small onClose={onCancel}>
            <ModalTitle>{title}</ModalTitle>
            <ModalContent>
                <p>{text}</p>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onCancel}>{i18n.t('Cancel')}</Button>
                    <Button
                        destructive={destructive}
                        primary={!destructive}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

ConfirmModal.propTypes = {
    confirmText: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    destructive: PropTypes.bool,
}

export default ConfirmModal
