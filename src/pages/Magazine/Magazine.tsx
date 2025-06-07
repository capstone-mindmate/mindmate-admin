import { useEffect, useState } from "react";
import NavigationComponent from "../../components/Navigation/NavigationComponent";
import {
    MagazineContainer, MagazineContent, HeadText,
    ChartWrapper, MagazineTable, TableHeader, TableCell,
    Modal, ModalContent, ButtonGroup, ActionButton
} from "./MagazineStyles";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchWithRefresh } from '../../utils/fetchWithRefresh';

Chart.register(ArcElement, Tooltip, Legend);

interface MagazineContentType {
    id: number;
    type: string;
    text: string | null;
    imageUrl: string | null;
    emoticonUrl: string | null;
    emoticonName: string | null;
    contentOrder: number;
}
interface Magazine {
    id: number;
    title: string;
    subtitle: string;
    contents: MagazineContentType[];
    authorName: string;
    authorId: number;
    likeCount: number;
    status: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}
interface MagazineCategoryStatistics {
    category: string;
    count: number;
}
interface PageMagazineResponse {
    content: Magazine[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

const Magazine = () => {
    const [stats, setStats] = useState<MagazineCategoryStatistics[]>([]);
    const [pending, setPending] = useState<Magazine[]>([]);
    const [modalMagazine, setModalMagazine] = useState<Magazine | null>(null);

    useEffect(() => {
        fetchStats();
        fetchPending();
    }, []);

    const fetchStats = async () => {
        const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/magazine/stats/category`);
        const data = await res.json();
        setStats(data);
    };

    const fetchPending = async () => {
        const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/magazine/pending?page=0&size=100`);
        const data: PageMagazineResponse = await res.json();
        setPending(data.content);
    };

    const handleDecision = async (id: number, isAccepted: boolean) => {
        await fetchWithRefresh(
            `${import.meta.env.VITE_API_SERVER_URL}/admin/magazine/${id}?isAccepted=${isAccepted}`,
            { method: 'POST' }
        );
        setModalMagazine(null);
        fetchPending();
    };

    const chartData = {
        labels: stats.map(s => s.category),
        datasets: [{
            data: stats.map(s => s.count),
            backgroundColor: [
                '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ],
        }]
    };

    return (
        <MagazineContainer>
            <NavigationComponent />
            <MagazineContent>
                <HeadText>매거진 관리</HeadText>
                <ChartWrapper>
                    <Doughnut data={chartData} />
                </ChartWrapper>
                <MagazineTable>
                    <thead>
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>제목</TableHeader>
                            <TableHeader>카테고리</TableHeader>
                            <TableHeader>작성자</TableHeader>
                            <TableHeader>좋아요</TableHeader>
                            <TableHeader>등록일</TableHeader>
                            <TableHeader>작업</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {pending.length > 0 ? pending.map(magazine => (
                            <tr key={magazine.id} style={{ cursor: 'pointer' }} onClick={() => setModalMagazine(magazine)}>
                                <TableCell>{magazine.id}</TableCell>
                                <TableCell>{magazine.title}</TableCell>
                                <TableCell>{magazine.category}</TableCell>
                                <TableCell>{magazine.authorName}</TableCell>
                                <TableCell>{magazine.likeCount}</TableCell>
                                <TableCell>{new Date(magazine.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell onClick={e => e.stopPropagation()}>
                                    <ButtonGroup>
                                        <ActionButton variant="accept" onClick={() => handleDecision(magazine.id, true)}>승인</ActionButton>
                                        <ActionButton variant="reject" onClick={() => handleDecision(magazine.id, false)}>거절</ActionButton>
                                    </ButtonGroup>
                                </TableCell>
                            </tr>
                        )) : <tr><TableCell colSpan={7} style={{ textAlign: 'center' }}>등록된 매거진이 없습니다.</TableCell></tr>}
                    </tbody>
                </MagazineTable>
                {modalMagazine && (
                    <Modal onClick={() => setModalMagazine(null)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <h2>{modalMagazine.title}</h2>
                            <p><b>부제목:</b> {modalMagazine.subtitle}</p>
                            <div style={{ margin: '16px 0' }}>
                                <b>콘텐츠:</b>
                                <div style={{ marginTop: 8 }}>
                                    {modalMagazine.contents.map(content => (
                                        <div key={content.id} style={{ marginBottom: 12 }}>
                                            {content.type === 'TEXT' && content.text && (
                                                <div dangerouslySetInnerHTML={{ __html: content.text }} />
                                            )}
                                            {content.type === 'IMAGE' && content.imageUrl && (
                                                <img
                                                    src={`${import.meta.env.VITE_API_SERVER_URL}${content.imageUrl}`}
                                                    alt="매거진 이미지"
                                                    style={{ maxWidth: 300, display: 'block', margin: '8px 0' }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <ButtonGroup>
                                <ActionButton variant="accept" onClick={() => handleDecision(modalMagazine.id, true)}>승인</ActionButton>
                                <ActionButton variant="reject" onClick={() => handleDecision(modalMagazine.id, false)}>거절</ActionButton>
                            </ButtonGroup>
                        </ModalContent>
                    </Modal>
                )}
            </MagazineContent>
        </MagazineContainer>
    );
};

export default Magazine;