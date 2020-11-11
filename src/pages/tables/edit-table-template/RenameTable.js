import React, { useState } from 'react'
import PropTypes from 'prop-types'
import InputDialog from '../../../components/InputDialog'
import i18n from '../../../locales'
import IconTooltipButton from '../../../components/IconTooltipButton'

export function RenameTable({ name, onRename }) {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const toggleModal = () => setModalIsOpen(state => !state)

    return (
        <>
            <IconTooltipButton
                icon="edit"
                tooltip="Rename table"
                size="18px"
                onClick={toggleModal}
            />
            {modalIsOpen && (
                <InputDialog
                    confirmText={i18n.t('Save')}
                    inputLabel={i18n.t('Table name')}
                    inputPlaceholder={i18n.t('Enter a name')}
                    title={i18n.t('Rename table')}
                    onCancel={toggleModal}
                    onConfirm={inputText => {
                        onRename(inputText)
                        toggleModal()
                    }}
                    initialValue={name}
                />
            )}
        </>
    )
}

RenameTable.propTypes = {
    name: PropTypes.string.isRequired,
    onRename: PropTypes.func.isRequired,
}

export default RenameTable
