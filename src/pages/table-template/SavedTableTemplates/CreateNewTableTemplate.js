import React, { useState } from 'react'
import i18n from '../../../locales'
import PropTypes from 'prop-types'
import { Button } from '@dhis2/ui'
import InputModal from '../../../components/InputModal'

export function CreateNewTableTemplate({ createNew }) {
    const [modalOpen, setModalOpen] = useState(false)

    function onCreateNew(inputText) {
        setModalOpen(false)
        createNew(inputText)
    }

    return (
        <>
            <Button onClick={() => setModalOpen(true)}>
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
        </>
    )
}

CreateNewTableTemplate.propTypes = {
    createNew: PropTypes.func.isRequired,
}
