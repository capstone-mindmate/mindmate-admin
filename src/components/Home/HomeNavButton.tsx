/** @jsxImportSource @emotion/react */
import { HomeNavButtonContainer } from "./HomeNavStyles.tsx";


interface HomeNavButtonProps {
    text: string;
    onClick: () => void;
}


export const HomeNavButton = ({ text, onClick }: HomeNavButtonProps) => {
    return (
        <HomeNavButtonContainer onClick={onClick}>
            <p>{text}</p>
        </HomeNavButtonContainer>
    )
}

