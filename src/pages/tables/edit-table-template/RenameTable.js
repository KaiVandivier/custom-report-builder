import React, { useState } from 'react'
import PropTypes from 'prop-types'
import InputModal from '../../../components/InputModal'
import Icon from '../../../components/Icon'
import styles from './styles/RenameTable.style'
import i18n from '../../../locales'

// TODO: Use a tooltip to say `rename`

function RenameTable({ name, onRename }) {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const toggleModal = () => setModalIsOpen(state => !state)

    return (
        <>
            <button onClick={toggleModal}>
                <Icon name="edit" />
            </button>
            {modalIsOpen && (
                <InputModal
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
            <style jsx>{styles}</style>
        </>
    )
}

RenameTable.propTypes = {
    name: PropTypes.string.isRequired,
    onRename: PropTypes.func.isRequired,
}

export default RenameTable
