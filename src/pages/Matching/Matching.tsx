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

type CreatorRole = "SPEAKER" | "LISTENER";

type MatchingListItem = {
    id: number;
    title: string;
    description: string;
    category: MatchingCategory;
    department: string;
    creatorRole: CreatorRole;
};

interface PageMatchingResponse {
    content: MatchingListItem[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

// 상세 타입
interface MatchingDetailResponse {
    id: number;
    title: string;
    description: string;
    category: MatchingCategory;
    status: "OPEN" | "MATCHED" | "REJECTED" | "CANCELED";
    createdAt: string;
    waitingCount: number;
    anonymous: boolean;
    showDepartment: boolean;
    creatorRole: CreatorRole;
    creatorId: number;
    creatorNickname: string;
    creatorProfileImage: string;
    creatorDepartment: string;
    creatorCounselingCount: number;
    creatorAvgRating: number;
}

const PAGE_SIZE = 20;

const Matching = () => {
    const [category, setCategory] = useState<MatchingCategory>("ACADEMIC");
    const [matchings, setMatchings] = useState<MatchingListItem[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalDetail, setModalDetail] = useState<MatchingDetailResponse | null>(null);
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
            const res = await fetchWithRefresh(`https://mindmate.shop/api/admin/matchings?${params}`);
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

    // 상세 조회
    const handleRowClick = async (matchingId: number) => {
        try {
            const res = await fetchWithRefresh(`https://mindmate.shop/api/matchings/${matchingId}`);
            const data: MatchingDetailResponse = await res.json();
            setModalDetail(data);
        } catch {
            setModalDetail(null);
            alert('상세 정보를 불러오지 못했습니다.');
        }
    };

    // 반려 처리
    // const handleReject = async (matchingId: number) => {
    //     if (!window.confirm('정말 이 매칭을 반려하시겠습니까?')) return;
    //     try {
    //         await fetchWithRefresh(`https://mindmate.shop/api/admin/matchings/${matchingId}`, {
    //             method: 'PATCH',
    //         });
    //         setModalDetail(null);
    //         setPage(0);
    //         fetchMatchings(true);
    //     } catch {
    //         alert('반려 처리에 실패했습니다.');
    //     }
    // };

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
                            <TableHeader>학과</TableHeader>
                            <TableHeader>생성자 역할</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {matchings.length === 0 && !loading ? (
                            <tr><TableCell colSpan={5} style={{ textAlign: 'center' }}>데이터가 없습니다.</TableCell></tr>
                        ) : (
                            matchings.map((matching, idx) => (
                                <tr
                                    key={matching.id}
                                    ref={idx === matchings.length - 1 ? lastRowRef : undefined}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleRowClick(matching.id)}
                                >
                                    <TableCell>{matching.id}</TableCell>
                                    <TableCell>{matching.title}</TableCell>
                                    <TableCell>{MATCHING_CATEGORIES.find(c => c.value === matching.category)?.label || matching.category}</TableCell>
                                    <TableCell>{matching.department}</TableCell>
                                    <TableCell>{matching.creatorRole === 'SPEAKER' ? '스피커' : '리스너'}</TableCell>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
                {loading && <div style={{ textAlign: 'center', margin: 16 }}>로딩 중...</div>}
                {error && <div style={{ color: 'red', textAlign: 'center', margin: 16 }}>{error}</div>}
                {modalDetail && (
                    <Modal onClick={() => setModalDetail(null)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <h2>매칭 상세</h2>
                            <p><b>ID:</b> {modalDetail.id}</p>
                            <p><b>제목:</b> {modalDetail.title}</p>
                            <p><b>카테고리:</b> {MATCHING_CATEGORIES.find(c => c.value === modalDetail.category)?.label || modalDetail.category}</p>
                            <p><b>상태:</b> {modalDetail.status}</p>
                            <p><b>설명:</b> {modalDetail.description}</p>
                            <p><b>생성일:</b> {new Date(modalDetail.createdAt).toLocaleString()}</p>
                            <p><b>대기 인원:</b> {modalDetail.waitingCount}</p>
                            <p><b>익명 여부:</b> {modalDetail.anonymous ? '예' : '아니오'}</p>
                            <p><b>학과 표시:</b> {modalDetail.showDepartment ? '예' : '아니오'}</p>
                            <p><b>생성자 역할:</b> {modalDetail.creatorRole === 'SPEAKER' ? '화자' : '청자'}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                                <img
                                    src={modalDetail.creatorProfileImage ? `https://mindmate.shop/api${modalDetail.creatorProfileImage}` : ''}
                                    alt="프로필"
                                    style={{ width: 48, height: 48, borderRadius: '50%' }}
                                />
                                <div>
                                    <p><b>생성자:</b> {modalDetail.creatorNickname}</p>
                                    <p><b>생성자 ID:</b> {modalDetail.creatorId}</p>
                                    <p><b>생성자 학과:</b> {modalDetail.creatorDepartment}</p>
                                    <p><b>상담 횟수:</b> {modalDetail.creatorCounselingCount}</p>
                                    <p><b>평균 평점:</b> {modalDetail.creatorAvgRating}</p>
                                </div>
                            </div>
                            <ButtonGroup>
                                {/* <ActionButton variant="reject" onClick={() => handleReject(modalDetail.id)}>반려</ActionButton> */}
                                <ActionButton variant="accept" onClick={() => setModalDetail(null)}>닫기</ActionButton>
                            </ButtonGroup>
                        </ModalContent>
                    </Modal>
                )}
            </MatchingContent>
        </MatchingContainer>
    );
};

export default Matching;