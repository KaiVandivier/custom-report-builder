import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import i18n from '../locales'
import classes from './styles/BackButton.module.css'

export function BackButton({ to, text }) {
    return (
        <Link to={to} className={classes.link}>
            <div>
                <Icon name="arrow_back" color="inherit" size="18px" />{' '}
                <span>{text || i18n.t('Back')}</span>
            </div>
            <style jsx>{`
                div {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            `}</style>
        </Link>
    )
}

BackButton.propTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string,
}

export default BackButton
