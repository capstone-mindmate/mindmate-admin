import { useEffect, useState } from "react";
import NavigationComponent from "../../components/Navigation/NavigationComponent";
import {
    ToastboxContainer, ToastboxContent, HeadText,
    Form, InputGroup, Label, TextInput, SubmitButton,
    KeywordsTable, TableHeader, TableCell,
    Modal, ModalContent, ButtonGroup, ActionButton
} from "./ToastboxStyles";
import { fetchWithRefresh } from '../../utils/fetchWithRefresh';

interface ToastBoxKeyword {
    id: number;
    keyword: string;
    title: string | null;
    content: string | null;
    linkUrl: string | null;
    imageUrl: string | null;
    active: boolean;
}

const initialForm = {
    keyword: "",
    title: "",
    content: "",
    linkUrl: "",
    imageUrl: ""
};

const Toastbox = () => {
    const [keywords, setKeywords] = useState<ToastBoxKeyword[]>([]);
    const [form, setForm] = useState(initialForm);
    const [modalKeyword, setModalKeyword] = useState<ToastBoxKeyword | null>(null);
    const [editForm, setEditForm] = useState(initialForm);

    useEffect(() => { fetchKeywords(); }, []);

    const fetchKeywords = async () => {
        const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/toast-box/keywords`);
        const data = await res.json();
        setKeywords(data);
    };

    const refreshKeywords = async () => {
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/toast-box/keywords/refresh`, { method: 'POST' });
        fetchKeywords();
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.keyword.trim()) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/toast-box/keywords`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        setForm(initialForm);
        await refreshKeywords();
    };

    const handleEdit = (keyword: ToastBoxKeyword) => {
        setModalKeyword(keyword);
        setEditForm({
            keyword: keyword.keyword || "",
            title: keyword.title || "",
            content: keyword.content || "",
            linkUrl: keyword.linkUrl || "",
            imageUrl: keyword.imageUrl || ""
        });
    };

    const handleUpdate = async () => {
        if (!modalKeyword) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/toast-box/keywords/${modalKeyword.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm),
        });
        setModalKeyword(null);
        await refreshKeywords();
    };

    const handleDelete = async () => {
        if (!modalKeyword) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/toast-box/keywords/${modalKeyword.id}`, {
            method: 'DELETE',
        });
        setModalKeyword(null);
        await refreshKeywords();
    };

    const handleActivate = async () => {
        if (!modalKeyword) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/toast-box/keywords/${modalKeyword.id}/activate`, {
            method: 'PUT',
        });
        setModalKeyword(null);
        await refreshKeywords();
    };

    const handleDeactivate = async () => {
        if (!modalKeyword) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/toast-box/keywords/${modalKeyword.id}/deactivate`, {
            method: 'PUT',
        });
        setModalKeyword(null);
        await refreshKeywords();
    };

    return (
        <ToastboxContainer>
            <NavigationComponent />
            <ToastboxContent>
                <HeadText>토스트박스 관리</HeadText>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label>키워드</Label>
                        <TextInput name="keyword" value={form.keyword} onChange={handleFormChange} required />
                    </InputGroup>
                    <InputGroup>
                        <Label>제목</Label>
                        <TextInput name="title" value={form.title} onChange={handleFormChange} />
                    </InputGroup>
                    <InputGroup>
                        <Label>내용</Label>
                        <TextInput name="content" value={form.content} onChange={handleFormChange} />
                    </InputGroup>
                    <InputGroup>
                        <Label>링크 URL</Label>
                        <TextInput name="linkUrl" value={form.linkUrl} onChange={handleFormChange} />
                    </InputGroup>
                    <InputGroup>
                        <Label>이미지 URL</Label>
                        <TextInput name="imageUrl" value={form.imageUrl} onChange={handleFormChange} />
                    </InputGroup>
                    <SubmitButton type="submit">키워드 추가</SubmitButton>
                </Form>
                <KeywordsTable>
                    <thead>
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>키워드</TableHeader>
                            <TableHeader>제목</TableHeader>
                            <TableHeader>상태</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {keywords.map(keyword => (
                            <tr key={keyword.id} style={{ cursor: 'pointer' }} onClick={() => handleEdit(keyword)}>
                                <TableCell>{keyword.id}</TableCell>
                                <TableCell>{keyword.keyword}</TableCell>
                                <TableCell>{keyword.title}</TableCell>
                                <TableCell>{keyword.active ? '활성' : '비활성'}</TableCell>
                            </tr>
                        ))}
                    </tbody>
                </KeywordsTable>
                {modalKeyword && (
                    <Modal onClick={() => setModalKeyword(null)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <h2>키워드 상세/수정</h2>
                            <InputGroup>
                                <Label>키워드</Label>
                                <TextInput name="keyword" value={editForm.keyword} onChange={handleEditFormChange} />
                            </InputGroup>
                            <InputGroup>
                                <Label>제목</Label>
                                <TextInput name="title" value={editForm.title} onChange={handleEditFormChange} />
                            </InputGroup>
                            <InputGroup>
                                <Label>내용</Label>
                                <TextInput name="content" value={editForm.content} onChange={handleEditFormChange} />
                            </InputGroup>
                            <InputGroup>
                                <Label>링크 URL</Label>
                                <TextInput name="linkUrl" value={editForm.linkUrl} onChange={handleEditFormChange} />
                            </InputGroup>
                            <InputGroup>
                                <Label>이미지 URL</Label>
                                <TextInput name="imageUrl" value={editForm.imageUrl} onChange={handleEditFormChange} />
                            </InputGroup>
                            <ButtonGroup>
                                <ActionButton variant="accept" onClick={handleUpdate}>수정</ActionButton>
                                {modalKeyword.active ? (
                                    <ActionButton variant="reject" onClick={handleDeactivate}>비활성화</ActionButton>
                                ) : (
                                    <ActionButton variant="accept" onClick={handleActivate}>활성화</ActionButton>
                                )}
                                <ActionButton variant="reject" onClick={handleDelete}>삭제</ActionButton>
                            </ButtonGroup>
                        </ModalContent>
                    </Modal>
                )}
            </ToastboxContent>
        </ToastboxContainer>
    );
};

export default Toastbox;
