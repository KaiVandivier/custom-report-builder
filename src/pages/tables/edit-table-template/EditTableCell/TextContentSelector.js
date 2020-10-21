import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Divider } from '@dhis2/ui'
import InputModal from '../../../../components/InputModal'
import IconTooltipButton from '../../../../components/IconTooltipButton'
import i18n from '../../../../locales'
import styles from './styles/ContentSelector.style'

export function TextContentSelector({ text, onChange }) {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const toggleModal = () => setModalIsOpen(state => !state)

    return (
        <>
            <Divider></Divider>
            <div className="container" onClick={toggleModal}>
                <div>
                    <div className="header">{i18n.t('Static Text')}</div>
                    <p>
                        {text.length ? (
                            text
                        ) : (
                            <em>{i18n.t('No text selected')}</em>
                        )}
                    </p>
                </div>
                <IconTooltipButton
                    icon="edit"
                    tooltip={i18n.t('Edit text')}
                    size={'18px'}
                    // onClick={toggleModal}
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
            <style jsx>{styles}</style>
        </>
    )
}

TextContentSelector.propTypes = {
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default TextContentSelector
