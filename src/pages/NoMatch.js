import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../locales'

export function NoMatch({ location }) {
    console.log(location)
    return (
        <div>
            <h3>
                {i18n.t("No page found for URL '{{- url}}'", {
                    url: location.pathname,
                })}
            </h3>
        </div>
    )
}

NoMatch.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string,
    }).isRequired,
}

export default NoMatch
