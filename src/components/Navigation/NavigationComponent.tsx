/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";

import {  NavPanel, TopBox, HeadText, NavigationBox } from "./NavigationComponentStyle.tsx";

import { HomeNavButton } from "../../components/Home/HomeNavButton.tsx";
import { fetchWithRefresh } from "../../utils/fetchWithRefresh.ts";

export default function NavigationComponent() {
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await fetchWithRefresh(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      localStorage.removeItem('auth-store')
      localStorage.removeItem('userId')
      localStorage.removeItem('register_step')
      navigate('/login', { replace: true })
    } catch (e: unknown) {
      console.error("Error! : ", e);
    }
  }

  const navigationList = [
    { text: "회원관리", onClick: () => navigate('/users') },
    { text: "신고관리", onClick: () => navigate('/report') },
    { text: "매칭관리", onClick: () => navigate('/matching') },
    { text: "이모티콘 목록", onClick: () => navigate('/emoticons_list') },
    { text: "이모티콘 관리", onClick: () => navigate('/emoticons') },
    { text: "매거진 수락", onClick: () => navigate('/magazine') },
    { text: "매거진 목록", onClick: () => navigate('/magazine_list') },
    { text: "토스트박스 키워드 관리", onClick: () => navigate('/toastbox') },
    { text: "결제 상품 관리", onClick: () => navigate('/payments') },
    { text: "필터링 단어 관리", onClick: () => navigate('/filter') },
    { text: "리뷰 관리", onClick: () => navigate('/review') },
    { text: "공지알림 전송", onClick: () => navigate('/notification') },
    { text: "로그아웃", onClick: () => handleLogout() },
  ]

  return (
      <NavPanel>
        <TopBox>
          <HeadText onClick={() => {
            navigate('/')
          }}>MindMate</HeadText>
        </TopBox>

        <NavigationBox>
          {navigationList.map((item, index) => (
            <HomeNavButton key={index} text={item.text} onClick={item.onClick} />
          ))}
        </NavigationBox>
      </NavPanel>
  );
}
