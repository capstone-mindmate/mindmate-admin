import { useState, useEffect } from 'react';
import { 
    EmoticonsContainer, 
    EmoticonContent, 
    HeadText, 
    UploadForm, 
    FileInput, 
    SubmitButton,
    EmoticonTable,
    TableHeader,
    TableCell,
    Modal,
    ModalContent,
    ModalImage,
    ButtonGroup,
    ActionButton,
    InputGroup,
    Label,
    TextInput
} from "./EmoticonsStyles";
import NavigationComponent from "../../components/Navigation/NavigationComponent";
import { fetchWithRefresh } from '../../utils/fetchWithRefresh';

interface EmoticonRequest {
    id: number;
    imageUrl: string;
    status: string;
    createdAt: string;
    name: string;
    price: number;
    fileSize: number;
}

interface EmoticonUploadData {
    name: string;
    price: number;
}

const Emoticons = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [emoticons, setEmoticons] = useState<EmoticonRequest[]>([]);
    const [selectedEmoticon, setSelectedEmoticon] = useState<EmoticonRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadData, setUploadData] = useState<EmoticonUploadData>({
        name: '',
        price: 0
    });

    useEffect(() => {
        fetchPendingEmoticons();
    }, []);

    const fetchPendingEmoticons = async () => {
        try {
            const response = await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/admin/emoticons/pending`);
            const data = await response.json();
            setEmoticons(data);
        } catch (error) {
            console.error('이모티콘 목록 조회 실패:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'price') {
            // 숫자만 추출하고 앞의 0 제거
            const numericValue = value.replace(/^0+/, '') || '0';
            setUploadData(prev => ({
                ...prev,
                [name]: Number(numericValue)
            }));
        } else {
            setUploadData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile) {
            alert('이미지 파일을 선택해주세요.');
            return;
        }
        if (!uploadData.name.trim()) {
            alert('이모티콘 이름을 입력해주세요.');
            return;
        }
        if (uploadData.price <= -1) {
            alert('가격을 올바르게 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append(
            'request',
            new Blob([JSON.stringify(uploadData)], { type: 'application/json' })
        );

        try {
            await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/emoticons/upload`, {
                method: 'POST',
                body: formData,
            });
            setSelectedFile(null);
            setUploadData({ name: '', price: 0 });
            fetchPendingEmoticons();
        } catch (error) {
            console.error('이모티콘 업로드 실패:', error);
        }
    };

    const handleAccept = async (emoticonId: number) => {
        try {
            await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/admin/emoticons/${emoticonId}/accept`, {
                method: 'POST',
            });
            setIsModalOpen(false);
            fetchPendingEmoticons();
        } catch (error) {
            console.error('이모티콘 승인 실패:', error);
        }
    };

    const handleReject = async (emoticonId: number) => {
        try {
            await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/admin/emoticons/${emoticonId}/reject`, {
                method: 'POST',
            });
            setIsModalOpen(false);
            fetchPendingEmoticons();
        } catch (error) {
            console.error('이모티콘 거절 실패:', error);
        }
    };

    return (
        <EmoticonsContainer>
            <NavigationComponent />
            <EmoticonContent>
                <HeadText>이모티콘 관리</HeadText>
                
                <UploadForm onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label htmlFor="name">이모티콘 이름</Label>
                        <TextInput
                            id="name"
                            name="name"
                            type="text"
                            value={uploadData.name}
                            onChange={handleInputChange}
                            placeholder="이모티콘 이름을 입력하세요"
                            required
                        />
                    </InputGroup>
                    
                    <InputGroup>
                        <Label htmlFor="price">가격</Label>
                        <TextInput
                            id="price"
                            name="price"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={uploadData.price}
                            onChange={handleInputChange}
                            placeholder="가격을 입력하세요"
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="file">이미지 파일</Label>
                        <FileInput 
                            id="file"
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            required
                        />
                    </InputGroup>
                    
                    <SubmitButton type="submit">이모티콘 업로드</SubmitButton>
                </UploadForm>

                <EmoticonTable>
                    <thead>
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>이미지</TableHeader>
                            <TableHeader>이름</TableHeader>
                            <TableHeader>가격</TableHeader>
                            <TableHeader>파일사이즈</TableHeader>
                            <TableHeader>등록일</TableHeader>
                            <TableHeader>작업</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {emoticons.map((emoticon) => (
                            <tr key={emoticon.id} onClick={() => {
                                setSelectedEmoticon(emoticon);
                                setIsModalOpen(true);
                            }} style={{ cursor: 'pointer' }}>
                                <TableCell>{emoticon.id}</TableCell>
                                <TableCell>
                                    <img 
                                        src={`${import.meta.env.VITE_API_LOCAL_URL}` + emoticon.imageUrl} 
                                        alt={`이모티콘 ${emoticon.id}`}
                                        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                    />
                                </TableCell>
                                <TableCell>{emoticon.name}</TableCell>
                                <TableCell>{emoticon.price.toLocaleString()}원</TableCell>
                                <TableCell>{(emoticon.fileSize / (1024 * 1024)).toFixed(2)}MB</TableCell>
                                <TableCell>{new Date(emoticon.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell onClick={() => {}}>
                                    <ButtonGroup>
                                        <ActionButton 
                                            variant="accept" 
                                            onClick={() => handleAccept(emoticon.id)}
                                        >
                                            승인
                                        </ActionButton>
                                        <ActionButton 
                                            variant="reject" 
                                            onClick={() => handleReject(emoticon.id)}
                                        >
                                            거절
                                        </ActionButton>
                                    </ButtonGroup>
                                </TableCell>
                            </tr>
                        ))}
                    </tbody>
                </EmoticonTable>

                {isModalOpen && selectedEmoticon && (
                    <Modal onClick={() => setIsModalOpen(false)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <ModalImage 
                                src={`${import.meta.env.VITE_API_LOCAL_URL}` + selectedEmoticon.imageUrl} 
                                alt={`이모티콘 ${selectedEmoticon.id}`}
                            />
                            <div style={{ marginBottom: '20px' }}>
                                <p><strong>이름:</strong> {selectedEmoticon.name}</p>
                                <p><strong>가격:</strong> {selectedEmoticon.price.toLocaleString()}원</p>
                            </div>
                            <ButtonGroup>
                                <ActionButton 
                                    variant="accept" 
                                    onClick={() => handleAccept(selectedEmoticon.id)}
                                >
                                    승인
                                </ActionButton>
                                <ActionButton 
                                    variant="reject" 
                                    onClick={() => handleReject(selectedEmoticon.id)}
                                >
                                    거절
                                </ActionButton>
                            </ButtonGroup>
                        </ModalContent>
                    </Modal>
                )}
            </EmoticonContent>
        </EmoticonsContainer>
    );
};

export default Emoticons;
