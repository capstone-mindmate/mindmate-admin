/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

export const MagazineContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

export const MagazineContent = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: white;
  overflow-y: auto;
`;

export const HeadText = styled.h1`
  font-size: 30px;
  font-weight: 600;
  color: black;
  margin: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-top: 50px;
`;

export const ChartWrapper = styled.div`
  width: 400px;
  margin: 40px auto 30px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MagazineTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  background: #fff;
`;

export const TableHeader = styled.th`
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  text-align: left;
`;

export const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: scroll;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  min-width: 350px;
  max-width: 90vw;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 24px;
  justify-content: flex-end;
`;

export const ActionButton = styled.button<{ variant: "accept" | "reject" }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  background-color: ${(props) =>
    props.variant === "accept" ? "#28a745" : "#dc3545"};
  color: white;
  &:hover {
    background-color: ${(props) =>
      props.variant === "accept" ? "#218838" : "#c82333"};
  }
`;
