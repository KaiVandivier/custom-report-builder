import React, { useState } from 'react'
import i18n from '../../../locales'
import PropTypes from 'prop-types'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    InputField,
} from '@dhis2/ui'

export function CreateNewTableTemplate({ createNew }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [name, setName] = useState('')

    function onCreateNew() {
        setModalOpen(false)
        createNew(name)
    }

    return (
        <>
            <Button onClick={() => setModalOpen(true)}>
                {i18n.t('Create new')}
            </Button>
            {modalOpen && (
                <Modal>
                    <ModalTitle>
                        {i18n.t('Create new table template')}
                    </ModalTitle>
                    <ModalContent>
                        <InputField
                            label={i18n.t('Table name')}
                            name="name"
                            placeholder={i18n.t('Enter a name')}
                            onChange={ref => setName(ref.value)}
                            value={name}
                        />
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button onClick={() => setModalOpen(false)}>
                                {i18n.t('Cancel')}
                            </Button>
                            <Button primary onClick={onCreateNew}>
                                {i18n.t('Create')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    )
}

CreateNewTableTemplate.propTypes = {
    createNew: PropTypes.func.isRequired,
}
