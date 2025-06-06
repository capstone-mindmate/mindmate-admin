/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
// import { media } from '../../../styles/breakpoints'


export const NavPanel = styled.div`
    width: 300px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #1B45F3;
    border-radius: 0 10px 10px 0;
    position: relative;
`


export const HeadText = styled.p`
    font-size: 30px;
    font-weight: 600;
    color: white;
    margin: 0;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
    }
`

export const TopBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 30px;
`


export const NavigationBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`