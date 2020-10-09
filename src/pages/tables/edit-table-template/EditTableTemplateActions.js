import React, { useState } from 'react'
import { Button, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../../../locales'
import ConfirmModal from '../../../components/ConfirmModal'

export function EditTableTemplateActions({ onSave, onGenerate, onDelete }) {
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const toggleModal = () => setDeleteModalIsOpen(state => !state)

    return (
        <div style={{ marginBottom: '0.5rem' }}>
            <ButtonStrip middle>
                {/* Save & Exit? */}
                {/* Exit? */}
                <Button small primary onClick={onSave}>
                    {i18n.t('Save')}
                </Button>
                <Button
                    small
                    primary
                    onClick={() => {
                        onSave()
                        onGenerate()
                    }}
                >
                    {i18n.t('Save & Generate')}
                </Button>
                <Button small destructive onClick={toggleModal}>
                    {i18n.t('Delete')}
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
        </div>
    )
}

EditTableTemplateActions.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
}

export default EditTableTemplateActions
