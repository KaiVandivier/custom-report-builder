import React, { useState } from 'react'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../../../../locales'
import OrganisationUnitPicker from '../../../../components/OrganisationUnitPicker'

export function OrgUnitSelectorDialog({
    open,
    currentlySelected = [],
    onSave,
    toggleModal,
}) {
    const [selected, setSelected] = useState(currentlySelected)

    if (!open) return null

    return (
        <Modal onClose={toggleModal}>
            <ModalTitle>{i18n.t('Select organisation unit(s)')}</ModalTitle>
            <ModalContent>
                <OrganisationUnitPicker
                    selectedOrgUnits={selected}
                    setSelectedOrgUnits={setSelected}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={toggleModal}>{i18n.t('Cancel')}</Button>
                    <Button
                        primary
                        onClick={() => {
                            onSave(selected)
                            toggleModal()
                        }}
                    >
                        {i18n.t('Save')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

OrgUnitSelectorDialog.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    currentlySelected: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            path: PropTypes.string,
        })
    ),
    open: PropTypes.bool,
}

export default OrgUnitSelectorDialog
