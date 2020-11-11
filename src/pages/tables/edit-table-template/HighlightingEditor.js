import React, { useState } from 'react'
import { Button, ButtonStrip, InputFieldFF, Switch, colors } from '@dhis2/ui'
import {
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
    hasValue,
    number,
    composeValidators,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../../../locales'
import { UPDATE_TABLE } from '../../../reducers/tableReducer'
import styles from './styles/HighlightingEditor.style'
import utils from '../../../styles/utils.module.css'
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

function HighlightingEditorDialog({ open, toggle, onSave }) {
    const table = useTableState()
    if (!open) return null

    const getTableRows = () => {
        const validateField = idx =>
            composeValidators(
                hasValue,
                number,
                betweenNeighbors('lowerBounds', idx)
            )

        return table.highlightingIntervals.map((interval, idx, arr) => (
            <TableRow key={idx}>
                <TableCell>
                    {arr.length === 1 ? (
                        'All values'
                    ) : idx === arr.length - 1 ? (
                        <em className="no-lb">{i18n.t('No lower bound')}</em>
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
                    <div
                        className="color-swatch"
                        style={{
                            backgroundColor: interval.color,
                        }}
                    />
                </TableCell>
                <style jsx>{`
                    .no-lb {
                        padding-left: 0.5rem;
                    }
                    .field-container {
                        max-width: 200px;
                        margin-right: auto;
                    }
                `}</style>
                <style jsx>{styles}</style>
            </TableRow>
        ))
    }

    return (
        <Modal small onClose={toggle}>
            <ModalTitle>{i18n.t('Edit Highlighting Intervals')}</ModalTitle>
            <Form onSubmit={onSave}>
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

HighlightingEditorDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
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

    return (
        <div>
            <div className="switch-container">
                <Switch
                    checked={table.highlightingOn}
                    label={i18n.t('Highlight cells based on value')}
                    onChange={onSwitch}
                />
            </div>
            <Button
                small
                disabled={!table.highlightingOn}
                onClick={toggleModal}
            >
                {i18n.t('Configure')}
            </Button>
            <HighlightingEditorDialog
                open={modalIsOpen}
                toggle={toggleModal}
                onSave={onSubmit}
            />
            <style jsx>{styles}</style>
        </div>
    )
}

HighlightingEditor.propTypes = {}

export default HighlightingEditor
