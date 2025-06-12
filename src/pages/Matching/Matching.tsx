import { useEffect, useState, useRef } from "react";
import NavigationComponent from "../../components/Navigation/NavigationComponent";
import {
    MatchingContainer, MatchingContent, HeadText,
} from "./MatchingStyles";
import {
    MagazineTable as Table,
    TableHeader,
    TableCell,
    Modal,
    ModalContent,
    ButtonGroup,
    ActionButton
} from "../Magazine/MagazineStyles";
import { fetchWithRefresh } from '../../utils/fetchWithRefresh';

// 매칭 카테고리 Enum
const MATCHING_CATEGORIES = [
    { value: "ACADEMIC", label: "학업" },
    { value: "CAREER", label: "진로" },
    { value: "RELATIONSHIP", label: "대인관계" },
    { value: "FINANCIAL", label: "금전" },
    { value: "EMPLOYMENT", label: "취업" },
    { value: "OTHER", label: "기타" },
];

type MatchingCategory = typeof MATCHING_CATEGORIES[number]["value"];

// MatchingResponse 타입 (스웨거 기반)
interface MatchingResponse {
    id: number;
    title: string;
    description: string;
    category: MatchingCategory;
    status: string;
    createdAt: string;
    updatedAt: string;
    ownerId: number;
    ownerName: string;
    ownerProfileImage: string;
    // 필요시 추가
}

interface PageMatchingResponse {
    content: MatchingResponse[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

const PAGE_SIZE = 20;

const Matching = () => {
    const [category, setCategory] = useState<MatchingCategory>("ACADEMIC");
    const [matchings, setMatchings] = useState<MatchingResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalMatching, setModalMatching] = useState<MatchingResponse | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastRowRef = useRef<HTMLTableRowElement | null>(null);

    // 매칭 목록 조회
    const fetchMatchings = async (reset = false) => {
        setLoading(true);
        setError(null);
        try {
            const params = [
                `page=${reset ? 0 : page}`,
                `size=${PAGE_SIZE}`,
                `matchingCategory=${category}`
            ].join('&');
            const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/matchings?${params}`);
            const data: PageMatchingResponse = await res.json();
            if (reset) {
                setMatchings(data.content);
            } else {
                setMatchings(prev => [...prev, ...data.content]);
            }
            setTotalPages(data.totalPages);
        } catch {
            setError('매칭 목록을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 변경 시
    useEffect(() => {
        setPage(0);
        fetchMatchings(true);
        // eslint-disable-next-line
    }, [category]);

    // 페이지 변경 시(무한스크롤)
    useEffect(() => {
        if (page === 0) return;
        fetchMatchings();
        // eslint-disable-next-line
    }, [page]);

    // Intersection Observer
    useEffect(() => {
        if (loading || page + 1 >= totalPages) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new window.IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prev => prev + 1);
            }
        });
        if (lastRowRef.current) observer.current.observe(lastRowRef.current);
    }, [loading, matchings, totalPages, page]);

    // 반려 처리
    const handleReject = async (matchingId: number) => {
        if (!window.confirm('정말 이 매칭을 반려하시겠습니까?')) return;
        try {
            await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/matchings/${matchingId}`, {
                method: 'PATCH',
            });
            setModalMatching(null);
            setPage(0);
            fetchMatchings(true);
        } catch {
            alert('반려 처리에 실패했습니다.');
        }
    };

    return (
        <MatchingContainer>
            <NavigationComponent />
            <MatchingContent>
                <HeadText>매칭 관리</HeadText>
                <div style={{ margin: '24px 0', width: '100%', maxWidth: 400 }}>
                    <label>
                        카테고리
                        <select
                            style={{ marginLeft: 12, padding: '6px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 14 }}
                            value={category}
                            onChange={e => setCategory(e.target.value as MatchingCategory)}
                        >
                            {MATCHING_CATEGORIES.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>제목</TableHeader>
                            <TableHeader>카테고리</TableHeader>
                            <TableHeader>상태</TableHeader>
                            <TableHeader>생성일</TableHeader>
                            <TableHeader>작성자</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {matchings.length === 0 && !loading ? (
                            <tr><TableCell colSpan={6} style={{ textAlign: 'center' }}>데이터가 없습니다.</TableCell></tr>
                        ) : (
                            matchings.map((matching, idx) => (
                                <tr
                                    key={matching.id}
                                    ref={idx === matchings.length - 1 ? lastRowRef : undefined}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setModalMatching(matching)}
                                >
                                    <TableCell>{matching.id}</TableCell>
                                    <TableCell>{matching.title}</TableCell>
                                    <TableCell>{MATCHING_CATEGORIES.find(c => c.value === matching.category)?.label || matching.category}</TableCell>
                                    <TableCell>{matching.status}</TableCell>
                                    <TableCell>{new Date(matching.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <img
                                                src={`${import.meta.env.VITE_API_SERVER_URL}${matching.ownerProfileImage}`}
                                                alt="프로필"
                                                style={{ width: 24, height: 24, borderRadius: '50%' }}
                                            />
                                            {matching.ownerName}
                                        </div>
                                    </TableCell>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
                {loading && <div style={{ textAlign: 'center', margin: 16 }}>로딩 중...</div>}
                {error && <div style={{ color: 'red', textAlign: 'center', margin: 16 }}>{error}</div>}
                {modalMatching && (
                    <Modal onClick={() => setModalMatching(null)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <h2>매칭 상세</h2>
                            <p><b>ID:</b> {modalMatching.id}</p>
                            <p><b>제목:</b> {modalMatching.title}</p>
                            <p><b>카테고리:</b> {MATCHING_CATEGORIES.find(c => c.value === modalMatching.category)?.label || modalMatching.category}</p>
                            <p><b>상태:</b> {modalMatching.status}</p>
                            <p><b>설명:</b> {modalMatching.description}</p>
                            <p><b>생성일:</b> {new Date(modalMatching.createdAt).toLocaleString()}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                                <img
                                    src={`${import.meta.env.VITE_API_SERVER_URL}${modalMatching.ownerProfileImage}`}
                                    alt="프로필"
                                    style={{ width: 48, height: 48, borderRadius: '50%' }}
                                />
                                <div>
                                    <p><b>작성자:</b> {modalMatching.ownerName}</p>
                                    <p><b>작성자 ID:</b> {modalMatching.ownerId}</p>
                                </div>
                            </div>
                            <ButtonGroup>
                                <ActionButton variant="reject" onClick={() => handleReject(modalMatching.id)}>반려</ActionButton>
                                <ActionButton variant="accept" onClick={() => setModalMatching(null)}>닫기</ActionButton>
                            </ButtonGroup>
                        </ModalContent>
                    </Modal>
                )}
            </MatchingContent>
        </MatchingContainer>
    );
};

export default Matching;