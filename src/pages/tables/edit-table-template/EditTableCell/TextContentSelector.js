import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Divider } from '@dhis2/ui'
import InputModal from '../../../../components/InputModal'
import IconTooltipButton from '../../../../components/IconTooltipButton'
import i18n from '../../../../locales'

// TODO: Use a tooltip to say `rename`
// TODO: Refactor to 'tooltip icon button'

export function TextContentSelector({ text, onChange }) {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const toggleModal = () => setModalIsOpen(state => !state)

    return (
        <>
            <Divider></Divider>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <p>{i18n.t('Text - {{-text}}', { text })}</p>
                <IconTooltipButton
                    icon="edit"
                    tooltip={i18n.t('Edit text')}
                    onClick={toggleModal}
                />
            </div>
            {modalIsOpen && (
                <InputModal
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
