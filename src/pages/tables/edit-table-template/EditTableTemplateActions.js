import React, { useState } from 'react'
import { Button, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../../../locales'
import ConfirmModal from '../../../components/ConfirmModal'
import Icon from '../../../components/Icon'

export function EditTableTemplateActions({ onSave, onGenerate, onDelete }) {
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const toggleModal = () => setDeleteModalIsOpen(state => !state)

    return (
        <div>
            <ButtonStrip middle>
                {/* Save & Exit? */}
                {/* Exit? */}
                <Button icon={<Icon name="save" />} onClick={onSave}>
                    {i18n.t('Save')}
                </Button>
                <Button
                    icon={<Icon name="play_arrow" />}
                    onClick={() => {
                        onSave()
                        onGenerate()
                    }}
                >
                    {i18n.t('Save & Generate')}
                </Button>
                <Button icon={<Icon name="delete" />} onClick={toggleModal}>
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
