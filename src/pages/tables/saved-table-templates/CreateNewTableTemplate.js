import React, { useState } from 'react'
import i18n from '../../../locales'
import PropTypes from 'prop-types'
import { Button, ButtonStrip } from '@dhis2/ui'
import InputDialog from '../../../components/InputDialog'
import Icon from '../../../components/Icon'

export function CreateNewTableTemplate({ createNew }) {
    const [modalOpen, setModalOpen] = useState(false)

    function onCreateNew(inputText) {
        setModalOpen(false)
        createNew(inputText)
    }

    return (
        <div>
            <ButtonStrip>
                <Button
                    icon={<Icon name="add" color="white" />}
                    onClick={() => setModalOpen(true)}
                    primary
                >
                    {i18n.t('Create new')}
                </Button>
            </ButtonStrip>
            {modalOpen && (
                <InputDialog
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
