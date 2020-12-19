import React, { useState } from 'react'
import { Button, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../../../locales'
import ConfirmModal from '../../../components/ConfirmModal'
import Icon from '../../../components/Icon'

export function EditTableTemplateActions({ onGenerate, onDelete }) {
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const toggleModal = () => setDeleteModalIsOpen(state => !state)

    return (
        <>
            <ButtonStrip>
                <Button
                    secondary
                    large
                    icon={<Icon name="delete" />}
                    onClick={toggleModal}
                >
                    {i18n.t('Delete')}
                </Button>
                <Button
                    large
                    primary
                    icon={<Icon name="play_arrow" color="white" />}
                    onClick={onGenerate}
                >
                    {i18n.t('Generate Report')}
                </Button>
            </ButtonStrip>
            {deleteModalIsOpen && (
                <ConfirmModal
                    confirmText={i18n.t('Delete')}
                    text={i18n.t('Really delete this template?')}
                    title={i18n.t('Confirm deletion')}
                    onCancel={toggleModal}
                    onConfirm={() => {
                        onDelete()
                        toggleModal()
                    }}
                    destructive={true}
                />
            )}
        </>
    )
}

EditTableTemplateActions.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
}

export default EditTableTemplateActions
