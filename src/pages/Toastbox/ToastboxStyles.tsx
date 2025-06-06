/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'

export const ToastboxContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
`

export const ToastboxContent = styled.div`
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
`

export const HeadText = styled.p`
    font-size: 30px;
    font-weight: 600;
    color: black;
    margin: 0;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-top: 50px;
`