import React, { useState } from 'react'
import { MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'

import Icon from '../../../components/Icon'
import ConfirmModal from '../../../components/ConfirmModal'
import i18n from '../../../locales'

export function DeleteTableTemplate({ onDeleteConfirmation, onCancel }) {
    const [modalIsOpen, setModalIsOpen] = useState(false)

    return (
        <>
            <MenuItem
                icon={<Icon name="delete" />}
                label={i18n.t('Delete')}
                onClick={() => setModalIsOpen(true)}
            />
            {modalIsOpen && (
                <ConfirmModal
                    destructive
                    title={i18n.t('Confirm delete')}
                    text={i18n.t(
                        'Are you sure you want to delete this template?'
                    )}
                    confirmText={i18n.t('Delete')}
                    onCancel={() => {
                        if (onCancel) onCancel()
                        setModalIsOpen(false)
                    }}
                    onConfirm={() => {
                        onDeleteConfirmation()
                        setModalIsOpen(false)
                    }}
                />
            )}
        </>
    )
}

DeleteTableTemplate.propTypes = {
    onDeleteConfirmation: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
}

export default DeleteTableTemplate
