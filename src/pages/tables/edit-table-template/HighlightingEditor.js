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
    createMinNumber,
    createMaxNumber,
    composeValidators,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../../../locales'
import { UPDATE_TABLE } from '../../../reducers/tableReducer'
import styles from './styles/HighlightingEditor.style'

const defaultIntervals = [
    { lowerBound: 90, color: colors.green100 },
    { lowerBound: 70, color: colors.yellow100 },
    { lowerBound: -Infinity, color: colors.red100 },
]

const { Form, Field } = ReactFinalForm

// function IntervalEditor({ values, intervals }) {
//     /**
//      * 'lowerBound' must have a value greater than the interval below and
//      * lesser than the interval above. It must also do so dynamically as
//      * the fields change with user input.
//      */
//     const validateField = (idx, arr) =>
//         composeValidators(
//             hasValue,
//             number,
//             createMinNumber(
//                 idx === arr.length - 1
//                     ? -Infinity
//                     : Number(
//                           values[`lowerBound-${idx + 1}`] ||
//                               arr[idx + 1].lowerBound
//                       )
//             ),
//             createMaxNumber(
//                 idx === 0
//                     ? Infinity
//                     : Number(
//                           values[`lowerBound-${idx - 1}`] ||
//                               arr[idx - 1].lowerBound
//                       )
//             )
//         )

//     return intervals.map((interval, idx, arr) => (
//         <div className="interval-container" key={idx}>
//             <div
//                 className="color-swatch"
//                 style={{
//                     backgroundColor: interval.color,
//                 }}
//             />
//             {idx === arr.length - 1 ? (
//                 idx === 0 ? (
//                     <span>All values</span>
//                 ) : (
//                     <>
//                         <span>
//                             {i18n.t('Value {{-lt}} {{value}}', {
//                                 lt: '\x3C',
//                                 value: values[`lowerBound-${idx - 1}`],
//                             })}
//                         </span>
//                     </>
//                 )
//             ) : (
//                 <>
//                     <span>Value &ge;</span>
//                     <Field
//                         dense
//                         name={`lowerBound-${idx}`}
//                         component={InputFieldFF}
//                         validate={validateField(idx, arr)}
//                         initialValue={String(interval.lowerBound)}
//                     />
//                 </>
//             )}
//             <style jsx>{styles}</style>
//         </div>
//     ))
// }

export function HighlightingEditor({ table, dispatch }) {
    // TODO: Get intervals from the table itself
    const [intervals, setIntervals] = useState(
        table.highlightingIntervals || defaultIntervals
    )
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const toggleModal = () => setModalIsOpen(state => !state)

    function onSwitch() {
        dispatch({
            type: UPDATE_TABLE,
            payload: { highlightingOn: !table.highlightingOn },
        })
    }

    function onSubmit(values) {
        console.log(values)
        // TODO: Fix me
        setIntervals([...Object.values(values)])
    }

    function getIntervalEditors(values) {
        /**
         * 'lowerBound' must have a value greater than the interval below and
         * lesser than the interval above. It must also do so dynamically as
         * the fields change with user input.
         */
        const validateField = (idx, arr) =>
            composeValidators(
                hasValue,
                number,
                createMinNumber(
                    idx === arr.length - 1
                        ? -Infinity
                        : Number(
                              values[`lowerBound-${idx + 1}`] ||
                                  arr[idx + 1].lowerBound
                          )
                ),
                createMaxNumber(
                    idx === 0
                        ? Infinity
                        : Number(
                              values[`lowerBound-${idx - 1}`] ||
                                  arr[idx - 1].lowerBound
                          )
                )
            )

        return intervals.map((interval, idx, arr) => (
            <div className="interval-container" key={idx}>
                <div
                    className="color-swatch"
                    style={{
                        backgroundColor: interval.color,
                    }}
                />
                {idx === arr.length - 1 ? (
                    idx === 0 ? (
                        <span>All values</span>
                    ) : (
                        <>
                            <span>
                                {i18n.t('Value {{-lt}} {{value}}', {
                                    lt: '\x3C',
                                    value: values[`lowerBound-${idx - 1}`],
                                })}
                            </span>
                        </>
                    )
                ) : (
                    <>
                        <span>Value &ge;</span>
                        <Field
                            dense
                            name={`lowerBound-${idx}`}
                            component={InputFieldFF}
                            validate={validateField(idx, arr)}
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
                    {/*TODO: Investigate 'name' and 'values' options */}
                    <Form onSubmit={onSubmit}>
                        {({
                            handleSubmit,
                            form,
                            submitting,
                            pristine,
                            values,
                            initialValues,
                        }) => {
                            console.log(values)
                            return (
                                <form onSubmit={handleSubmit}>
                                    <ModalContent>
                                        <div className="editor-container">
                                            {getIntervalEditors(values)}
                                        </div>
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
                                                disabled={
                                                    submitting || pristine
                                                }
                                            >
                                                {i18n.t('Reset')}
                                            </Button>
                                            <Button
                                                primary
                                                type="submit"
                                                disabled={submitting}
                                                // How to do?
                                                // onClick={toggleModal}
                                            >
                                                {i18n.t('Save')}
                                            </Button>
                                        </ButtonStrip>
                                    </ModalActions>
                                </form>
                            )
                        }}
                    </Form>
                </Modal>
            )}
            <style jsx>{styles}</style>
        </div>
    )
}

HighlightingEditor.propTypes = {
    dispatch: PropTypes.func.isRequired,
    table: PropTypes.shape({
        highlightingIntervals: PropTypes.array,
        highlightingOn: PropTypes.bool,
    }).isRequired,
}

export default HighlightingEditor
