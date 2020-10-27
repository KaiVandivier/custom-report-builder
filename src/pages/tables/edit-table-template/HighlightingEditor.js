import React, { useState } from 'react'
import { InputField, Switch, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../../../locales'
import { UPDATE_TABLE } from '../../../reducers/tableReducer'

const defaultIntervals = [
    { lowerBound: 90, color: colors.green100 },
    { lowerBound: 70, color: colors.yellow100 },
    { lowerBound: -Infinity, color: colors.red100 },
]

export function HighlightingEditor({ table, dispatch }) {
    const [intervals, setIntervals] = useState(defaultIntervals)

    function onSwitch() {
        dispatch({
            type: UPDATE_TABLE,
            payload: { highlightingOn: !table.highlightingOn },
        })
    }

    function onInputChange(value, idx) {
        setIntervals([
            ...intervals.slice(0, idx),
            { ...intervals[idx], lowerBound: value },
            ...intervals.slice(idx + 1),
        ])
    }

    return (
        <div style={{ marginBottom: '1rem' }}>
            <Switch
                checked={table.highlightingOn}
                label={i18n.t('Highlight cells based on value')}
                onChange={onSwitch}
            />
            {table.highlightingOn && (
                <div className="container">
                    {intervals.map((interval, idx) => (
                        <div className="interval-container" key={idx}>
                            <div className="color-swatch-container">
                                <div
                                    className="color-swatch"
                                    style={{ backgroundColor: interval.color }}
                                />
                            </div>
                            <span>Value &ge;</span>
                            <InputField
                                dense
                                value={String(interval.lowerBound)}
                                onChange={({ value }) =>
                                    onInputChange(value, idx)
                                }
                                required
                            />
                        </div>
                    ))}
                </div>
            )}
            {/* Should be 'less than' the same number the above is 'greater than' */}
            <style jsx>{`
                .container {
                    display: block;
                    max-width: 400px;
                    margin-top: 0.5rem;
                }

                .interval-container {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                .color-swatch-container {
                    display: inline-block;
                    padding: 0.25rem;
                    // background-color: white;
                    // border: 1px solid #ccc; // TODO: Get right color
                    border-radius: 0.25rem;
                }

                .color-swatch {
                    height: 1rem;
                    width: 2rem;
                    border: 1px solid #666; // TODO: Get right color
                }

                .color-swatch.green {
                    background-color: #e8f5e9; // TODO: Get right color
                }

                .color-swatch.yellow {
                    background-color: #ffecb3; // TODO: Get right color
                }

                .color-swatch.red {
                    background-color: #ffe5e8; // TODO: Get right color
                }
            `}</style>
        </div>
    )
}

HighlightingEditor.propTypes = {
    dispatch: PropTypes.func.isRequired,
    table: PropTypes.shape({
        highlightingOn: PropTypes.bool,
    }).isRequired,
}

export default HighlightingEditor
