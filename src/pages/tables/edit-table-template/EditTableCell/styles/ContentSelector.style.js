import css from 'styled-jsx/css'
import { colors, spacers } from '@dhis2/ui'

export default css`
    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: ${spacers.dp4} ${spacers.dp8} 0 ${spacers.dp8};
        border-radius: ${spacers.dp4};
    }

    .container:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    .header {
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        color: ${colors.grey800};
        text-decoration: underline;
    }

    .header + p {
        margin-top: ${spacers.dp4};
        margin-bottom: ${spacers.dp8};
    }
`
