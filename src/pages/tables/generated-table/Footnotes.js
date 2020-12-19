import React from 'react'
// import PropTypes from 'prop-types'
import { colors } from '@dhis2/ui'
import i18n from '../../../locales'

import { useFootnotes } from '../../../context/footnotesContext'

function Footnotes() {
    const { orgUnitFootnotes, periodFootnotes } = useFootnotes()

    function getFootnotes(footnotes) {
        return Array.from(footnotes.values()).map(({ id, description }) => (
            <div key={id}>
                {i18n.t('{{id}}{{c}} {{description}}', {
                    id,
                    description,
                    c: ':',
                })}
            </div>
        ))
    }

    return (
        <div className="footnotes">
            {/* Org units: */}
            {orgUnitFootnotes.size > 0 && (
                <>
                    <h6 className="footnote-header">
                        {i18n.t('Organisation Units{{c}}', { c: ':' })}
                    </h6>
                    {getFootnotes(orgUnitFootnotes)}
                </>
            )}

            {/* Periods: */}
            {periodFootnotes.size > 0 && (
                <>
                    <h6 className="footnote-header">
                        {i18n.t('Periods{{c}}', { c: ':' })}
                    </h6>
                    {getFootnotes(periodFootnotes)}
                </>
            )}

            <style jsx>{`
                .footnotes {
                    font-size: 0.75rem;
                    color: ${colors.grey700};
                }

                .footnote-header {
                    font-size: inherit;
                    font-weight: normal;
                    margin-top: 0.75rem;
                    margin-bottom: 0.5rem;
                }

                .footnote {
                }
            `}</style>
        </div>
    )
}

Footnotes.propTypes = {}

export default Footnotes
