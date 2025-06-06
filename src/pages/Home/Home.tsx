/** @jsxImportSource @emotion/react */

import { HomeContainer, ContentPanel } from "./styles/HomeStyle.tsx";

import NavigationComponent from "../../components/Navigation/NavigationComponent.tsx";

export default function Home() {

  return (
    <HomeContainer>
      <NavigationComponent />


      <ContentPanel>
        
      </ContentPanel>
    </HomeContainer>
  );
}
