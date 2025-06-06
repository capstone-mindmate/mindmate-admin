import { useEffect, useState } from "react";
import NavigationComponent from "../../components/Navigation/NavigationComponent";
import {
    FilterContainer, FilterContent, HeadText,
    Form, InputGroup, Label, TextInput, SubmitButton,
    WordsTable, TableHeader, TableCell,
    Modal, ModalContent, ButtonGroup, ActionButton
} from "./FilterStyles";
import { fetchWithRefresh } from '../../utils/fetchWithRefresh';

interface FilteringWord {
    id: number;
    word: string;
    active: boolean;
    createdAt: string;
}

const initialForm = {
    word: ""
};

const Filter = () => {
    const [words, setWords] = useState<FilteringWord[]>([]);
    const [form, setForm] = useState(initialForm);
    const [modalWord, setModalWord] = useState<FilteringWord | null>(null);
    const [editForm, setEditForm] = useState(initialForm);

    useEffect(() => { fetchWords(); }, []);

    const fetchWords = async () => {
        const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/filtering/words`);
        const data = await res.json();
        setWords(data);
    };

    const refreshWords = async () => {
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/filtering/words/refresh`, { method: 'POST' });
        fetchWords();
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
        if (!form.word.trim()) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/filtering/words`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        setForm(initialForm);
        await refreshWords();
    };

    const handleEdit = (word: FilteringWord) => {
        setModalWord(word);
        setEditForm({ word: word.word });
    };

    const handleUpdate = async () => {
        if (!modalWord) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/filtering/words/${modalWord.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm),
        });
        setModalWord(null);
        await refreshWords();
    };

    const handleDelete = async () => {
        if (!modalWord) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/filtering/words/${modalWord.id}`, {
            method: 'DELETE',
        });
        setModalWord(null);
        await refreshWords();
    };

    const handleActivate = async () => {
        if (!modalWord) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/filtering/words/${modalWord.id}/activate`, {
            method: 'PUT',
        });
        setModalWord(null);
        await refreshWords();
    };

    const handleDeactivate = async () => {
        if (!modalWord) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/filtering/words/${modalWord.id}/deactivate`, {
            method: 'PUT',
        });
        setModalWord(null);
        await refreshWords();
    };

    return (
        <FilterContainer>
            <NavigationComponent />
            <FilterContent>
                <HeadText>필터링 단어 관리</HeadText>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label>단어</Label>
                        <TextInput name="word" value={form.word} onChange={handleFormChange} required />
                    </InputGroup>
                    <SubmitButton type="submit">단어 추가</SubmitButton>
                </Form>
                <WordsTable>
                    <thead>
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>단어</TableHeader>
                            <TableHeader>활성 상태</TableHeader>
                            <TableHeader>생성 일자</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {words.map(word => (
                            <tr key={word.id} style={{ cursor: 'pointer' }} onClick={() => handleEdit(word)}>
                                <TableCell>{word.id}</TableCell>
                                <TableCell>{word.word}</TableCell>
                                <TableCell>{word.active ? '활성' : '비활성'}</TableCell>
                                <TableCell>{new Date(word.createdAt).toLocaleString()}</TableCell>
                            </tr>
                        ))}
                    </tbody>
                </WordsTable>
                {modalWord && (
                    <Modal onClick={() => setModalWord(null)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <h2>단어 상세/수정</h2>
                            <InputGroup>
                                <Label>단어</Label>
                                <TextInput name="word" value={editForm.word} onChange={handleEditFormChange} />
                            </InputGroup>
                            <ButtonGroup>
                                <ActionButton variant="accept" onClick={handleUpdate}>수정</ActionButton>
                                {modalWord.active ? (
                                    <ActionButton variant="reject" onClick={handleDeactivate}>비활성화</ActionButton>
                                ) : (
                                    <ActionButton variant="accept" onClick={handleActivate}>활성화</ActionButton>
                                )}
                                <ActionButton variant="reject" onClick={handleDelete}>삭제</ActionButton>
                            </ButtonGroup>
                        </ModalContent>
                    </Modal>
                )}
            </FilterContent>
        </FilterContainer>
    );
};

export default Filter;