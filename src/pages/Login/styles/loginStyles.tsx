/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { media } from '../../../styles/breakpoints'


export const LoginContainer = styled.div`
    width: 884px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  ${media.tablet} {
    width: 100%;
  }
`

export const MainText = styled.p`
  font-size: 24px;
  font-weight: bold;
`



export const googleButtonStyle = css`
  width: 500px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  ${media.tablet} {
    width: 100%;
    height: 40px;
    font-size: 13px;
  }

  ${media.mobileBig} {
    height: 36px;
    font-size: 12px;
  }
`

export const iconStyle = css`
  margin-right: 8px;
  width: 18px;
  height: 18px;

  ${media.tablet} {
    width: 16px;
    height: 16px;
  }

  ${media.mobileBig} {
    width: 14px;
    height: 14px;
  }
`
