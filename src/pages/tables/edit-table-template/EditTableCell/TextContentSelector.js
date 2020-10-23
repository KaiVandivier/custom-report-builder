import React, { useState } from 'react'
import PropTypes from 'prop-types'
import InputDialog from '../../../../components/InputDialog'
import i18n from '../../../../locales'
import SelectorFrame from '../SelectorFrame'

export function TextContentSelector({ text, onChange }) {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const toggleModal = () => setModalIsOpen(state => !state)

    return (
        <>
            <SelectorFrame
                title={i18n.t('Static Text')}
                content={
                    text.length ? text : <em>{i18n.t('No text selected')}</em>
                }
                tooltip={i18n.t('Edit text')}
                onClick={toggleModal}
            />
            {modalIsOpen && (
                <InputDialog
                    confirmText={i18n.t('Save')}
                    inputLabel={i18n.t('Cell text')}
                    inputPlaceholder={i18n.t('Enter text')}
                    title={i18n.t('Enter static text for cell')}
                    onCancel={toggleModal}
                    onConfirm={inputText => {
                        onChange(inputText)
                        toggleModal()
                    }}
                    initialValue={text}
                />
            )}
        </>
    )
}

TextContentSelector.propTypes = {
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default TextContentSelector
