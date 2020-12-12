import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    ButtonStrip,
    Divider,
    Help,
    Modal,
    ModalTitle,
    ModalContent,
} from '@dhis2/ui'
import { PeriodDimension } from '@dhis2/analytics'
import i18n from '../../../locales'
import OrganisationUnitPicker from '../../../components/OrganisationUnitPicker'

export function ReportParameters({
    open,
    errors,
    pickPeriods = true,
    pickOrgUnits = true,
    toggleModal,
    onGenerate,
}) {
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([])
    const [selectedPeriods, setSelectedPeriods] = useState([])

    if (!open) return null

    return (
        <Modal onClose={toggleModal}>
            <ModalTitle>{i18n.t('Report parameters')}</ModalTitle>
            <ModalContent>
                <Help>
                    {i18n.t(
                        'The parameter(s) chosen below will apply to all data cells that do not have that parameter specified in the template.'
                    )}
                </Help>
                {pickOrgUnits && (
                    <>
                        <h3>{i18n.t('Organisation Unit(s)')}</h3>
                        <OrganisationUnitPicker
                            selectedOrgUnits={selectedOrgUnits}
                            setSelectedOrgUnits={setSelectedOrgUnits}
                        />
                    </>
                )}
                {pickPeriods && (
                    <>
                        <h3>{i18n.t('Period(s)')}</h3>
                        <PeriodDimension
                            selectedPeriods={selectedPeriods}
                            onSelect={({ items }) => setSelectedPeriods(items)}
                        />
                    </>
                )}
                {!errors.length ? null : (
                    <div style={{ marginTop: '1rem' }}>
                        {errors.map(error => (
                            <Help error key={error}>
                                {error}
                            </Help>
                        ))}
                    </div>
                )}
                <Divider margin={'1rem 0'} />
                <ButtonStrip end>
                    <Button onClick={toggleModal}>{i18n.t('Cancel')}</Button>
                    <Button
                        primary
                        onClick={() => {
                            toggleModal()
                            onGenerate({
                                selectedOrgUnits,
                                selectedPeriods,
                            })
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
    errors: PropTypes.arrayOf(PropTypes.string),
    pickOrgUnits: PropTypes.bool,
    pickPeriods: PropTypes.bool,
}

export default ReportParameters
