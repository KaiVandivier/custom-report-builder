import css from 'styled-jsx/css'
import { colors } from '@dhis2/ui'

export default css`
    .switch-container {
        margin-bottom: 0.5rem;
    }

    .interval-container {
        display: flex;
        align-items: center;
        min-height: 2rem;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .color-swatch-container {
        display: inline-block;
        padding: 0.25rem;
        border-radius: 0.25rem;
    }

    .color-swatch {
        height: 1rem;
        width: 2rem;
        border: 1px solid ${colors.grey600};
    }

    .color-swatch.green {
        background-color: ${colors.green100};
    }

    .color-swatch.yellow {
        background-color: ${colors.yellow100};
    }

    .color-swatch.red {
        background-color: ${colors.red100};
    }
`
