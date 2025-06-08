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
    magazineCount: number;
}

const MagazineList = () => {
    const [magazines, setMagazines] = useState<Magazine[]>([]);
    const [modalMagazine, setModalMagazine] = useState<Magazine | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [stats, setStats] = useState<MagazineCategoryStatistics[]>([]);

    useEffect(() => {
        fetchMagazines();
        fetchStats();
    }, []);

    const fetchMagazines = async () => {
        const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/magazines`);
        const data = await res.json();
        setMagazines(data.content);
    };

    const fetchStats = async () => {
        const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/magazine/stats/category`);
        const data = await res.json();
        setStats(data);
    };

    const fetchMagazineDetail = async (id: number) => {
        const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/magazines/${id}`);
        const data = await res.json();
        setModalMagazine(data);
    };

    const handleDelete = async (id: number) => {
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/magazines/${id}`, {
            method: 'DELETE',
        });
        setModalMagazine(null);
        setDeleteConfirm(false);
        fetchMagazines();
    };

    const chartData = {
        labels: stats.map(s => s.category),
        datasets: [{
            data: stats.map(s => s.magazineCount),
            backgroundColor: [
                '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ],
        }]
    };

    return (
        <MagazineContainer>
            <NavigationComponent />
            <MagazineContent>
                <HeadText>매거진 목록</HeadText>
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
                        </tr>
                    </thead>
                    <tbody>
                        {magazines.length > 0 ? magazines.map(magazine => (
                            <tr key={magazine.id} style={{ cursor: 'pointer' }} onClick={() => fetchMagazineDetail(magazine.id)}>
                                <TableCell>{magazine.id}</TableCell>
                                <TableCell>{magazine.title}</TableCell>
                                <TableCell>{magazine.category}</TableCell>
                                <TableCell>{magazine.authorName}</TableCell>
                                <TableCell>{magazine.likeCount}</TableCell>
                                <TableCell>{new Date(magazine.createdAt).toLocaleDateString()}</TableCell>
                            </tr>
                        )) : <tr><TableCell colSpan={6} style={{ textAlign: 'center' }}>등록된 매거진이 없습니다.</TableCell></tr>}
                    </tbody>
                </MagazineTable>
                {modalMagazine && (
                    <Modal onClick={() => { setModalMagazine(null); setDeleteConfirm(false); }}>
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
                                {!deleteConfirm ? (
                                    <ActionButton variant="reject" onClick={() => setDeleteConfirm(true)}>삭제</ActionButton>
                                ) : (
                                    <>
                                        <span style={{ color: '#dc3545', marginRight: 8 }}>정말 삭제 하시겠습니까?</span>
                                        <ActionButton variant="reject" onClick={() => handleDelete(modalMagazine.id)}>확인</ActionButton>
                                        <ActionButton variant="accept" onClick={() => setDeleteConfirm(false)}>취소</ActionButton>
                                    </>
                                )}
                            </ButtonGroup>
                        </ModalContent>
                    </Modal>
                )}
            </MagazineContent>
        </MagazineContainer>
    );
};

export default MagazineList;