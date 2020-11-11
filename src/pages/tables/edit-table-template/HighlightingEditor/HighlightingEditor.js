import React, { useState } from 'react'
import { Button, Switch, colors } from '@dhis2/ui'
import i18n from '../../../../locales'
import { UPDATE_TABLE } from '../../../../reducers/tableReducer'
import styles from './styles/HighlightingEditor.style'
import {
    useTableDispatch,
    useTableState,
} from '../../../../context/tableContext'
import HighlightingEditorDialog from './HighlightingEditorDialog'

const defaultIntervals = [
    { lowerBound: 90, color: colors.green100 },
    { lowerBound: 70, color: colors.yellow100 },
    { lowerBound: -Infinity, color: colors.red100 },
]

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
