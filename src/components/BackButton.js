import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@dhis2/ui'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import i18n from '../locales'
import classes from './styles/BackButton.module.css'

function BackButton({ to, text }) {
    return (
        <Link to={to} className={classes.link}>
            <Button secondary icon={<Icon name="arrow_back" />}>
                {text || i18n.t('Back')}
            </Button>
        </Link>
    )
}

BackButton.propTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string,
}

export default BackButton
