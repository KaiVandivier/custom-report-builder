import React from 'react'
import { Redirect } from 'react-router-dom'
import { TABLES } from '../modules/paths'

export const NoMatch = () => <Redirect to={TABLES} />

export default NoMatch
