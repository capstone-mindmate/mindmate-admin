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

interface MagazineCategoryStatistics {
    category: string;
    count: number;
}
interface Magazine {
    id: number;
    title: string;
    author: string;
    category: string;
    createdAt: string;
    content: string;
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
        const res = await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/admin/magazine/stats/category`);
        const data = await res.json();
        setStats(data);
    };

    const fetchPending = async () => {
        const res = await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/admin/magazine/pending?page=0&size=100`);
        const data: PageMagazineResponse = await res.json();
        setPending(data.content);
    };

    const handleAccept = async (id: number) => {
        await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/admin/magazine/${id}/accept`, { method: 'POST' });
        setModalMagazine(null);
        fetchPending();
    };

    const handleReject = async (id: number) => {
        await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/admin/magazine/${id}/reject`, { method: 'POST' });
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
                            <TableHeader>등록일</TableHeader>
                            <TableHeader>작업</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        pending.length > 0 ? pending.map(magazine => (
                            <tr key={magazine.id} style={{ cursor: 'pointer' }} onClick={() => setModalMagazine(magazine)}>
                                <TableCell>{magazine.id}</TableCell>
                                <TableCell>{magazine.title}</TableCell>
                                <TableCell>{magazine.category}</TableCell>
                                <TableCell>{magazine.author}</TableCell>
                                <TableCell>{new Date(magazine.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell onClick={e => e.stopPropagation()}>
                                    <ButtonGroup>
                                        <ActionButton variant="accept" onClick={() => handleAccept(magazine.id)}>승인</ActionButton>
                                        <ActionButton variant="reject" onClick={() => handleReject(magazine.id)}>거절</ActionButton>
                                    </ButtonGroup>
                                </TableCell>
                            </tr>
                        )) : <tr><TableCell colSpan={6} style={{ textAlign: 'center' }}>등록된 매거진이 없습니다.</TableCell></tr>}
                    </tbody>
                </MagazineTable>
                {modalMagazine && (
                    <Modal onClick={() => setModalMagazine(null)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <h2>{modalMagazine.title}</h2>
                            <p><b>카테고리:</b> {modalMagazine.category}</p>
                            <p><b>작성자:</b> {modalMagazine.author}</p>
                            <p><b>등록일:</b> {new Date(modalMagazine.createdAt).toLocaleString()}</p>
                            <div style={{ margin: '16px 0' }}>
                                <b>내용:</b>
                                <div style={{ whiteSpace: 'pre-line', marginTop: 8 }}>{modalMagazine.content}</div>
                            </div>
                            <ButtonGroup>
                                <ActionButton variant="accept" onClick={() => handleAccept(modalMagazine.id)}>승인</ActionButton>
                                <ActionButton variant="reject" onClick={() => handleReject(modalMagazine.id)}>거절</ActionButton>
                            </ButtonGroup>
                        </ModalContent>
                    </Modal>
                )}
            </MagazineContent>
        </MagazineContainer>
    );
};

export default Magazine;