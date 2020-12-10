import React from 'react'
import {
    colors,
    Button,
    ButtonStrip,
    Help,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
    ReactFinalForm,
    InputFieldFF,
    hasValue,
    number,
    composeValidators,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../../../../locales'
import styles from './styles/HighlightingEditorDialog.style'
import utils from '../../../../styles/utils.module.css'

export const defaultIntervals = [
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

export function HighlightingEditorDialog({
    open,
    toggle,
    helpText,
    highlightingIntervals = defaultIntervals,
    onSave,
}) {
    if (!open) return null

    const onSubmit = values => {
        toggle()

        // Possible refactor: use constructor instead of the following logic
        const newIntervals = highlightingIntervals.map((interval, idx, arr) => {
            if (idx === arr.length - 1) return interval // remains -Infinity
            return {
                ...interval,
                lowerBound: values.lowerBounds[idx],
            }
        })

        onSave(newIntervals)
    }

    const getTableRows = () => {
        const validateField = idx =>
            composeValidators(
                hasValue,
                number,
                betweenNeighbors('lowerBounds', idx)
            )

        return highlightingIntervals.map((interval, idx, arr) => (
            <TableRow key={idx}>
                <TableCell>
                    {arr.length === 1 ? (
                        <span className="text-container">
                            {i18n.t('All values')}
                        </span>
                    ) : idx === arr.length - 1 ? (
                        <span className="text-container">
                            <em>{i18n.t('No lower bound')}</em>
                        </span>
                    ) : (
                        <div className="field-container">
                            <Field
                                dense
                                initialFocus={idx === 0}
                                name={`lowerBounds[${idx}]`}
                                component={InputFieldFF}
                                validate={validateField(idx)}
                                initialValue={String(interval.lowerBound)}
                            />
                        </div>
                    )}
                </TableCell>
                <TableCell>
                    <div className="color-swatch" />
                </TableCell>
                <style jsx>{`
                    .color-swatch {
                        background-color: ${interval.color};
                    }
                `}</style>
                <style jsx>{styles}</style>
            </TableRow>
        ))
    }

    return (
        <Modal small onClose={toggle}>
            <ModalTitle>{i18n.t('Edit Highlighting Intervals')}</ModalTitle>
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
                            {helpText && (
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <Help>{helpText}</Help>
                                </div>
                            )}
                            <Table
                                suppressZebraStriping
                                className={utils.noBorder}
                            >
                                <TableHead>
                                    <TableRowHead>
                                        <TableCellHead>
                                            {i18n.t('Lower bound of interval')}
                                        </TableCellHead>
                                        <TableCellHead
                                            style={{ width: 'max-content' }}
                                        >
                                            {i18n.t('Color')}
                                        </TableCellHead>
                                    </TableRowHead>
                                </TableHead>
                                <TableBody>{getTableRows(values)}</TableBody>
                            </Table>
                        </ModalContent>
                        <ModalActions>
                            <ButtonStrip end>
                                <Button onClick={toggle}>
                                    {i18n.t('Cancel')}
                                </Button>
                                <Button
                                    onClick={() => form.reset(initialValues)}
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
    )
}

HighlightingEditorDialog.defaultProps = {
    highlightingIntervals: defaultIntervals,
}

HighlightingEditorDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    helpText: PropTypes.string,
    highlightingIntervals: PropTypes.array,
}
