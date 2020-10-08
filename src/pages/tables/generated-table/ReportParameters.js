import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    ButtonStrip,
    Divider,
    Modal,
    ModalTitle,
    ModalContent,
} from '@dhis2/ui'
import { PeriodDimension } from '@dhis2/analytics'
import i18n from '../../../locales'
import OrganisationUnitPicker from '../../../components/OrganisationUnitPicker'

export function ReportParameters({ open, toggleModal, onGenerate }) {
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([])
    const [selectedPeriods, setSelectedPeriods] = useState([])

    if (!open) return null

    return (
        <Modal onClose={toggleModal}>
            <ModalTitle>{i18n.t('Report parameters')}</ModalTitle>
            <ModalContent>
                <h3>{i18n.t('Organisation Unit(s)')}</h3>
                <OrganisationUnitPicker
                    selectedOrgUnits={selectedOrgUnits}
                    setSelectedOrgUnits={setSelectedOrgUnits}
                />
                <h3>{i18n.t('Period(s)')}</h3>
                <PeriodDimension
                    selectedPeriods={selectedPeriods}
                    onSelect={({ items }) => setSelectedPeriods(items)}
                />
                <Divider margin={'1rem 0'} />
                <ButtonStrip middle>
                    <Button onClick={toggleModal}>{i18n.t('Cancel')}</Button>
                    <Button
                        primary
                        onClick={() => {
                            onGenerate({
                                selectedOrgUnits,
                                selectedPeriods,
                            })
                            toggleModal()
                        }}
                    >
                        {i18n.t('Generate')}
                    </Button>
                </ButtonStrip>
            </ModalContent>
        </Modal>
    )
}

ReportParameters.propTypes = {
    open: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
}

export default ReportParameters
