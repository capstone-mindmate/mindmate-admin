/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'

export const PaymentsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
`

export const PaymentsContent = styled.div`
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    overflow-y: auto;
`

export const HeadText = styled.p`
    font-size: 30px;
    font-weight: 600;
    color: black;
    margin: 0;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-top: 100px;
`

export const Form = styled.form`
    width: 100%;
    max-width: 500px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 32px;
    margin-top: 20px;
`;

export const InputGroup = styled.div`
    margin-bottom: 16px;
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
`;

export const TextInput = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
    &:focus { outline: none; border-color: #007bff; }
`;

export const Checkbox = styled.input`
    margin-right: 8px;
`;

export const SubmitButton = styled.button`
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    &:hover { background-color: #0056b3; }
`;

export const ProductsTable = styled.table`
    width: 90%;
    border-collapse: collapse;
    margin-top: 20px;
    background: #fff;
    margin-bottom: 50px;
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
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
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

export const ActionButton = styled.button<{ variant: 'accept' | 'reject' }>`
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    background-color: ${props => props.variant === 'accept' ? '#28a745' : '#dc3545'};
    color: white;
    &:hover {
        background-color: ${props => props.variant === 'accept' ? '#218838' : '#c82333'};
    }
`;