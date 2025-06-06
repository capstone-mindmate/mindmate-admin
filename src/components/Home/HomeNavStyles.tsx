/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'

export const HomeNavButtonContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        background-color: white;
    }
    p {
        color: white;
        transition: all 0.3s ease;
    }
    &:hover p {
        color: black;
    }
`