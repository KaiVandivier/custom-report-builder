import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
} from '@dhis2/ui'
import { PeriodDimension } from '@dhis2/analytics'
import i18n from '../../../../locales'

export function PeriodSelectorDialog({
    open,
    currentlySelected = [],
    toggleModal,
    onSave,
}) {
    const [selected, setSelected] = useState(currentlySelected)

    if (!open) return null

    return (
        <Modal onClose={toggleModal}>
            <ModalTitle>{i18n.t('Select period(s)')}</ModalTitle>
            <ModalContent>
                <PeriodDimension
                    selectedPeriods={selected}
                    onSelect={({ items }) => setSelected(items)}
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

PeriodSelectorDialog.propTypes = {
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

export default PeriodSelectorDialog
