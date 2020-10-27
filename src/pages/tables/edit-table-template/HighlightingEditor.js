import React from 'react'
import { Switch } from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../../../locales'
import { UPDATE_TABLE } from '../../../reducers/tableReducer'

export function HighlightingEditor({ table, dispatch }) {
    function onSwitch() {
        dispatch({
            type: UPDATE_TABLE,
            payload: { highlightingOn: !table.highlightingOn },
        })
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
                    <div className="interval-container">
                        <div className="color-swatch-container">
                            <div className="color-swatch green" />
                        </div>
                        <span>Value &ge; 90.0</span>
                    </div>

                    <div className="interval-container">
                        <div className="color-swatch-container">
                            <div className="color-swatch yellow" />
                        </div>
                        <span>Value &ge; 70.0</span>
                    </div>

                    <div className="interval-container">
                        <div className="color-swatch-container">
                            <div className="color-swatch red" />
                        </div>
                        <span>Value &lt; 70.0</span>
                        {/* Should be 'less than' the same number the above is 'greater than' */}
                    </div>
                </div>
            )}
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
