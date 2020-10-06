import React, { useState } from 'react'
import i18n from '../../../locales'
import PropTypes from 'prop-types'
import { Button } from '@dhis2/ui'
import InputModal from '../../../components/InputModal'
import Icon from '../../../components/Icon'

export function CreateNewTableTemplate({ createNew }) {
    const [modalOpen, setModalOpen] = useState(false)

    function onCreateNew(inputText) {
        setModalOpen(false)
        createNew(inputText)
    }

    return (
        <div style={{ marginBottom: '0.5rem' }}>
            <Button
                primary
                icon={<Icon name="add" color="white" />}
                onClick={() => setModalOpen(true)}
            >
                {i18n.t('Create new')}
            </Button>
            {modalOpen && (
                <InputModal
                    title={i18n.t('Create new table template')}
                    inputLabel={i18n.t('Table name')}
                    inputPlaceholder={i18n.t('Enter a name')}
                    initialValue={''}
                    confirmText={i18n.t('Create')}
                    onCancel={() => setModalOpen(false)}
                    onConfirm={onCreateNew}
                />
            )}
        </div>
    )
}

CreateNewTableTemplate.propTypes = {
    createNew: PropTypes.func.isRequired,
}

export default CreateNewTableTemplate
