import { ToastboxContainer, ToastboxContent, HeadText } from "./ToastboxStyles";
import NavigationComponent from "../../components/Navigation/NavigationComponent";

const Toastbox = () => {
  return (
    <ToastboxContainer>
      <NavigationComponent />
      <ToastboxContent>
        <HeadText>토스트박스 관리</HeadText>
      </ToastboxContent>
    </ToastboxContainer>
  );
};

export default Toastbox;
