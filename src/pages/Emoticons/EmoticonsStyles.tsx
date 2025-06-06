/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'


export const EmoticonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
`

export const EmoticonContent = styled.div`
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: white;
    overflow-y: auto;
`

export const HeadText = styled.h1`
    font-size: 30px;
    font-weight: 600;
    color: black;
    margin: 0;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-top: 50px;
`

export const UploadForm = styled.form`
    width: 100%;
    max-width: 600px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 30px;
    margin-top: 50px;
`

export const FileInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
`

export const SubmitButton = styled.button`
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    
    &:hover {
        background-color: #0056b3;
    }
`

export const EmoticonTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    margin-bottom: 50px;
`

export const TableHeader = styled.th`
    padding: 12px;
    text-align: left;
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
`

export const TableCell = styled.td`
    padding: 12px;
    border-bottom: 1px solid #dee2e6;
`

export const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`

export const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
`

export const ModalImage = styled.img`
    width: 100%;
    max-height: 300px;
    object-fit: contain;
    margin-bottom: 20px;
`

export const ButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
`

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
`

export const InputGroup = styled.div`
    margin-bottom: 15px;
`

export const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #333;
`

export const TextInput = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
        outline: none;
        border-color: #007bff;
    }
`