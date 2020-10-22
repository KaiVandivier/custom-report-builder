import css from 'styled-jsx/css'

export default css`
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1rem;
    }
`
