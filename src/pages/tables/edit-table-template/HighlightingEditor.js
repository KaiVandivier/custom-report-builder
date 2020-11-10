import React, { useState } from 'react'
import { Button, ButtonStrip, InputFieldFF, Switch, colors } from '@dhis2/ui'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ReactFinalForm,
    hasValue,
    number,
    composeValidators,
} from '@dhis2/ui'
// import PropTypes from 'prop-types'
import i18n from '../../../locales'
import { UPDATE_TABLE } from '../../../reducers/tableReducer'
import styles from './styles/HighlightingEditor.style'
import { useTableDispatch, useTableState } from '../../../context/tableContext'

const defaultIntervals = [
    { lowerBound: 90, color: colors.green100 },
    { lowerBound: 70, color: colors.yellow100 },
    { lowerBound: -Infinity, color: colors.red100 },
]

const { Form, Field } = ReactFinalForm

function betweenNeighbors(key, idx) {
    const tooHighMessage = i18n.t(
        'This value must be lower than the lower bound of the interval above it.'
    )
    const tooLowMessage = i18n.t(
        'This value must be higher than the lower bound of the interval below it.'
    )

    return (value, allValues) => {
        if (!allValues[key])
            throw new Error(`Form value with key '${key}' not found`)

        const length = allValues[key].length
        const tooHigh =
            idx > 0 && Number(value) > Number(allValues[key]?.[idx - 1])
        // The last lower bound is always -Infinity, and won't have an input
        const tooLow =
            idx < length - 1 &&
            Number(value) < Number(allValues[key]?.[idx + 1])

        return tooHigh ? tooHighMessage : tooLow ? tooLowMessage : undefined
    }
}

export function HighlightingEditor() {
    const table = useTableState()
    const dispatch = useTableDispatch()
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const toggleModal = () => setModalIsOpen(state => !state)

    function onSwitch({ checked }) {
        dispatch({
            type: UPDATE_TABLE,
            payload: {
                highlightingOn: !table.highlightingOn,
                highlightingIntervals:
                    checked && !table.highlightingIntervals
                        ? defaultIntervals
                        : table.highlightingIntervals,
            },
        })
    }

    function onSubmit(values) {
        toggleModal()

        const highlightingIntervals = defaultIntervals.map(
            (interval, idx, arr) => {
                if (idx === arr.length - 1) return interval
                return {
                    ...interval,
                    lowerBound: values.lowerBounds[idx],
                }
            }
        )

        dispatch({
            type: UPDATE_TABLE,
            payload: { highlightingIntervals },
        })
    }

    function getIntervalEditors(values) {
        const validateField = idx =>
            composeValidators(
                hasValue,
                number,
                betweenNeighbors('lowerBounds', idx)
            )

        return table.highlightingIntervals.map((interval, idx, arr) => (
            <div className="interval-container" key={idx}>
                <div
                    className="color-swatch"
                    style={{
                        backgroundColor: interval.color,
                    }}
                />
                {arr.length === 1 ? (
                    <span>All values</span>
                ) : idx === arr.length - 1 ? (
                    <span>
                        {i18n.t('Value {{-lt}} {{value}}', {
                            lt: '\x3C',
                            value: values.lowerBounds
                                ? values.lowerBounds[idx - 1]
                                : '',
                        })}
                    </span>
                ) : (
                    <>
                        <span>
                            {i18n.t('Value {{-gte}}', { gte: '\u2265' })}
                        </span>
                        <Field
                            dense
                            name={`lowerBounds[${idx}]`}
                            component={InputFieldFF}
                            validate={validateField(idx)}
                            initialValue={String(interval.lowerBound)}
                        />
                    </>
                )}
                <style jsx>{styles}</style>
            </div>
        ))
    }

    return (
        <div className="switch-container">
            <Switch
                checked={table.highlightingOn}
                label={i18n.t('Highlight cells based on value')}
                onChange={onSwitch}
            />
            <Button
                small
                disabled={!table.highlightingOn}
                onClick={toggleModal}
            >
                {i18n.t('Configure')}
            </Button>
            {modalIsOpen && (
                <Modal onClose={toggleModal}>
                    <ModalTitle>
                        {i18n.t('Edit Highlighting Intervals')}
                    </ModalTitle>
                    <Form onSubmit={onSubmit}>
                        {({
                            handleSubmit,
                            form,
                            submitting,
                            pristine,
                            values,
                            initialValues,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <ModalContent>
                                    {getIntervalEditors(values)}
                                </ModalContent>
                                <ModalActions>
                                    <ButtonStrip end>
                                        <Button onClick={toggleModal}>
                                            {i18n.t('Cancel')}
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                form.reset(initialValues)
                                            }
                                            disabled={submitting || pristine}
                                        >
                                            {i18n.t('Reset')}
                                        </Button>
                                        <Button
                                            primary
                                            type="submit"
                                            disabled={submitting}
                                        >
                                            {i18n.t('Save')}
                                        </Button>
                                    </ButtonStrip>
                                </ModalActions>
                            </form>
                        )}
                    </Form>
                </Modal>
            )}
            <style jsx>{styles}</style>
        </div>
    )
}

HighlightingEditor.propTypes = {}

export default HighlightingEditor
