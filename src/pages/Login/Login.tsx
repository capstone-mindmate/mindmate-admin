/** @jsxImportSource @emotion/react */
import { LoginContainer, MainText, googleButtonStyle, iconStyle } from "./styles/loginStyles";

export default function Login() {
  const handleGoogleLogin = () => {
    // 직접 OAuth URL로 이동
    // 백엔드에서 인증 완료 후 프론트엔드로 토큰과 함께 리디렉션해야 함
    window.location.href = "http://localhost/api/oauth2/authorize/google";
  };

  return (
    <LoginContainer>
      <MainText>관리자 로그인</MainText>

      <button css={googleButtonStyle} onClick={handleGoogleLogin} type="button">
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          css={iconStyle}
        />
        아주대학교 계정으로 로그인
      </button>
    </LoginContainer>
  );
}
