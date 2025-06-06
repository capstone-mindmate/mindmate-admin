import { useEffect, useState, useRef, useCallback } from "react";
import NavigationComponent from "../../components/Navigation/NavigationComponent";
import {
    ReviewContainer, ReviewContent, HeadText,
    Form, InputGroup, Label, TextInput, Checkbox, SubmitButton,
    ReviewsTable, TableHeader, TableCell,
    Modal, ModalContent, ButtonGroup, ActionButton
} from "./ReviewStyles";
import { fetchWithRefresh } from '../../utils/fetchWithRefresh';

interface Review {
    id: number;
    user: string;
    content: string;
    rating: number;
    reported: boolean;
    createdAt: string;
}
interface PageReviewResponse {
    content: Review[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

const initialFilter = {
    minRating: "",
    maxRating: "",
    reported: false
};

const PAGE_SIZE = 20;

const Review = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filter, setFilter] = useState(initialFilter);
    const [modalReview, setModalReview] = useState<Review | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastRowRef = useRef<HTMLTableRowElement | null>(null);

    const fetchReviews = useCallback(async (reset = false) => {
        setLoading(true);
        const params = [];
        if (filter.minRating) params.push(`minRating=${filter.minRating}`);
        if (filter.maxRating) params.push(`maxRating=${filter.maxRating}`);
        if (filter.reported) params.push(`reported=true`);
        params.push(`page=${reset ? 0 : page}`);
        params.push(`size=${PAGE_SIZE}`);
        const query = params.length ? `?${params.join("&")}` : "";
        const res = await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/admin/reviews${query}`);
        const data: PageReviewResponse = await res.json();
        if (reset) {
            setReviews(data.content);
        } else {
            setReviews(prev => [...prev, ...data.content]);
        }
        setHasMore(data.content.length === PAGE_SIZE);
        setLoading(false);
    }, [filter, page]);

    useEffect(() => {
        setPage(0);
        fetchReviews(true);
    }, [filter, fetchReviews]);

    useEffect(() => {
        if (page === 0) return;
        fetchReviews();
    }, [page, fetchReviews]);

    useEffect(() => {
        if (!hasMore || loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new window.IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prev => prev + 1);
            }
        });
        if (lastRowRef.current) observer.current.observe(lastRowRef.current);
    }, [hasMore, loading, reviews]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        fetchReviews(true);
    };

    const handleDelete = async () => {
        if (!modalReview) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/admin/reviews/${modalReview.id}`, {
            method: 'DELETE',
        });
        setModalReview(null);
        setDeleteConfirm(false);
        setPage(0);
        fetchReviews(true);
    };

    return (
        <ReviewContainer>
            <NavigationComponent />
            <ReviewContent>
                <HeadText>리뷰 관리</HeadText>
                <Form onSubmit={handleFilterSubmit}>
                    <InputGroup>
                        <Label>최소 평점</Label>
                        <TextInput name="minRating" type="number" min={1} max={5} value={filter.minRating} onChange={handleFilterChange} />
                    </InputGroup>
                    <InputGroup>
                        <Label>최대 평점</Label>
                        <TextInput name="maxRating" type="number" min={1} max={5} value={filter.maxRating} onChange={handleFilterChange} />
                    </InputGroup>
                    <InputGroup>
                        <Label>
                            <Checkbox name="reported" type="checkbox" checked={filter.reported} onChange={handleFilterChange} />
                            신고된 리뷰만 보기
                        </Label>
                    </InputGroup>
                    <SubmitButton type="submit">필터 적용</SubmitButton>
                </Form>
                <ReviewsTable>
                    <thead>
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>작성자</TableHeader>
                            <TableHeader>내용</TableHeader>
                            <TableHeader>평점</TableHeader>
                            <TableHeader>신고됨</TableHeader>
                            <TableHeader>작성일</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review, idx) => (
                            <tr
                                key={review.id}
                                ref={idx === reviews.length - 1 ? lastRowRef : undefined}
                                style={{ cursor: 'pointer' }}
                                onClick={() => { setModalReview(review); setDeleteConfirm(false); }}
                            >
                                <TableCell>{review.id}</TableCell>
                                <TableCell>{review.user}</TableCell>
                                <TableCell>{review.content}</TableCell>
                                <TableCell>{review.rating}</TableCell>
                                <TableCell>{review.reported ? 'Y' : 'N'}</TableCell>
                                <TableCell>{new Date(review.createdAt).toLocaleString()}</TableCell>
                            </tr>
                        ))}
                    </tbody>
                </ReviewsTable>
                {loading && <div style={{ textAlign: 'center', margin: 16 }}>로딩 중...</div>}
                {modalReview && (
                    <Modal onClick={() => setModalReview(null)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <h2>리뷰 상세</h2>
                            <p><b>ID:</b> {modalReview.id}</p>
                            <p><b>작성자:</b> {modalReview.user}</p>
                            <p><b>내용:</b> {modalReview.content}</p>
                            <p><b>평점:</b> {modalReview.rating}</p>
                            <p><b>신고됨:</b> {modalReview.reported ? 'Y' : 'N'}</p>
                            <p><b>작성일:</b> {new Date(modalReview.createdAt).toLocaleString()}</p>
                            <ButtonGroup>
                                {!deleteConfirm ? (
                                    <ActionButton variant="reject" onClick={() => setDeleteConfirm(true)}>삭제</ActionButton>
                                ) : (
                                    <>
                                        <span style={{ color: '#dc3545', marginRight: 8 }}>정말 삭제 하시겠습니까?</span>
                                        <ActionButton variant="reject" onClick={handleDelete}>확인</ActionButton>
                                        <ActionButton variant="accept" onClick={() => setDeleteConfirm(false)}>취소</ActionButton>
                                    </>
                                )}
                            </ButtonGroup>
                        </ModalContent>
                    </Modal>
                )}
            </ReviewContent>
        </ReviewContainer>
    );
};

export default Review;