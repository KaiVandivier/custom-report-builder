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
import i18n from '../locales'
import OrganisationUnitPicker from './OrganisationUnitPicker'

function ReportParameters({ onGenerate }) {
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([])
    const [selectedPeriods, setSelectedPeriods] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const toggleModal = () => setModalIsOpen(state => !state)

    // TODO: Remove after testing
    console.log('Org units', selectedOrgUnits)
    console.log('Period', selectedPeriods)

    return (
        <div>
            <Button onClick={toggleModal}>Open Modal (test)</Button>
            {modalIsOpen && (
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
                            <Button onClick={toggleModal}>
                                {i18n.t('Cancel')}
                            </Button>
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
            )}
        </div>
    )
}

ReportParameters.propTypes = {
    onGenerate: PropTypes.func.isRequired,
}

export default ReportParameters
