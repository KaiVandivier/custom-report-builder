import css from 'styled-jsx/css'
import { colors, spacers } from '@dhis2/ui'

export default css`
    .flex-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: ${colors.grey900};
        text-decoration: underline;
    }

    .header + p {
        margin-top: ${spacers.dp4};
        margin-bottom: ${spacers.dp8};
    }
`
