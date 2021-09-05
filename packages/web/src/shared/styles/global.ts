import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  #root {
    font-family: ${({ theme }) => {
      // @ts-ignore
      return theme.fonts.body
    }};
    color: ${({ theme }) => {
      // @ts-ignore
      return theme.colors.contrast
    }};
    font-size: 15px;
  }

  *,
  *:after,
  *:before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *:focus {
    outline: none;
  }
`
