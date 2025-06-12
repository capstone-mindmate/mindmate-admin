/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { useEffect, useState, useRef } from 'react'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { Modal, ModalContent, ButtonGroup, ActionButton } from '../../pages/Review/ReviewStyles'

// 신고 상세 타입
interface ReportDetail {
    id: number;
    reporterId: number;
    reporterName: string;
    reporterImage: string;
    reporterReportCount: number;
    reportedUserId: number;
    reportedUserName: string;
    reportedUserImage: string;
    reportedUserReportCount: number;
    reportReason: string;
    reportTarget: string;
    targetId: number;
    additionalComment: string;
    createdAt: string;
}

interface PageReportResponse {
    content: ReportDetail[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

const TARGET_OPTIONS = [
    { value: '', label: '전체' },
    { value: 'MATCHING', label: '매칭' },
    { value: 'CHATROOM', label: '채팅방' },
    { value: 'PROFILE', label: '프로필' },
    { value: 'MAGAZINE', label: '매거진' },
    { value: 'REVIEW', label: '리뷰' },
]
const REASON_OPTIONS = [
    { value: '', label: '전체' },
    { value: 'ABUSIVE_LANGUAGE', label: '욕설' },
    { value: 'SEXUAL_HARASSMENT', label: '성희롱' },
    { value: 'SPAM_OR_REPETITIVE', label: '스팸/도배' },
    { value: 'MALICIOUS_LINK', label: '악성링크' },
    { value: 'EXCESSIVE_PROMOTION', label: '과도한 홍보' },
    { value: 'PERSONAL_INFO_VIOLATION', label: '개인정보 침해' },
    { value: 'ILLEGAL_CONTENT', label: '불법 콘텐츠' },
    { value: 'OTHER', label: '기타' },
]

const PAGE_SIZE = 20

const styles = {
    container: css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    `,
    table: css`
        width: 90%;
        border-collapse: collapse;
        margin-top: 20px;
        background: #fff;
        margin-bottom: 100px;
    `,
    th: css`
        background-color: #f2f2f2;
        text-align: left;
        padding: 8px;
        border: 1px solid #ddd;
    `,
    td: css`
        padding: 8px;
        border: 1px solid #ddd;
    `,
    filterBox: css`
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        align-items: center;
    `,
    select: css`
        padding: 6px 12px;
        border-radius: 4px;
        border: 1px solid #ddd;
        font-size: 14px;
    `
}

const ReportTable = () => {
    const [reports, setReports] = useState<ReportDetail[]>([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [target, setTarget] = useState('')
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [modalReport, setModalReport] = useState<ReportDetail | null>(null)
    const observer = useRef<IntersectionObserver | null>(null)
    const lastRowRef = useRef<HTMLTableRowElement | null>(null)

    // 목록 조회
    const fetchReports = async (reset = false) => {
        setLoading(true)
        setError(null)
        try {
            const params = [
                `page=${reset ? 0 : page}`,
                `size=${PAGE_SIZE}`,
                target && `target=${target}`,
                reason && `reason=${reason}`,
            ].filter(Boolean).join('&')
            const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/reports?${params}`)
            const data: PageReportResponse = await res.json()
            if (reset) {
                setReports(data.content)
            } else {
                setReports(prev => [...prev, ...data.content])
            }
            setTotalPages(data.totalPages)
        } catch {
            setError('신고 목록을 불러오지 못했습니다.')
        } finally {
            setLoading(false)
        }
    }

    // 필터 변경 시
    useEffect(() => {
        setPage(0)
        fetchReports(true)
        // eslint-disable-next-line
    }, [target, reason])

    // 페이지 변경 시(무한스크롤)
    useEffect(() => {
        if (page === 0) return
        fetchReports()
        // eslint-disable-next-line
    }, [page])

    // Intersection Observer
    useEffect(() => {
        if (loading || page + 1 >= totalPages) return
        if (observer.current) observer.current.disconnect()
        observer.current = new window.IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prev => prev + 1)
            }
        })
        if (lastRowRef.current) observer.current.observe(lastRowRef.current)
    }, [loading, reports, totalPages, page])

    // 상세 조회
    const handleRowClick = async (reportId: number) => {
        try {
            const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/reports/${reportId}`)
            const data = await res.json()
            console.log('상세 데이터:', data)
            setModalReport(data)
        } catch (e) {
            console.error('상세 조회 에러:', e)
            setModalReport(null)
        }
    }

    return (
        <div css={styles.container}>
            <div css={styles.filterBox}>
                <label>
                    대상
                    <select css={styles.select} value={target} onChange={e => setTarget(e.target.value)}>
                        {TARGET_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </label>
                <label>
                    사유
                    <select css={styles.select} value={reason} onChange={e => setReason(e.target.value)}>
                        {REASON_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </label>
            </div>
            <table css={styles.table}>
                <thead>
                    <tr>
                        <th css={styles.th}>ID</th>
                        <th css={styles.th}>신고자</th>
                        <th css={styles.th}>신고자 신고횟수</th>
                        <th css={styles.th}>신고대상</th>
                        <th css={styles.th}>대상 신고횟수</th>
                        <th css={styles.th}>신고유형</th>
                        <th css={styles.th}>신고사유</th>
                        <th css={styles.th}>신고일</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.length === 0 && !loading ? (
                        <tr>
                            <td colSpan={8} css={styles.td}>데이터가 없습니다.</td>
                        </tr>
                    ) : (
                        reports.map((report, idx) => (
                            <tr
                                key={report.id}
                                ref={idx === reports.length - 1 ? lastRowRef : undefined}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleRowClick(report.id)}
                            >
                                <td css={styles.td}>{report.id}</td>
                                <td css={styles.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <img 
                                            src={`${import.meta.env.VITE_API_SERVER_URL}${report.reporterImage}`}
                                            alt="신고자 프로필"
                                            style={{ width: 24, height: 24, borderRadius: '50%' }}
                                        />
                                        {report.reporterName}
                                    </div>
                                </td>
                                <td css={styles.td}>{report.reporterReportCount}</td>
                                <td css={styles.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <img 
                                            src={`${import.meta.env.VITE_API_SERVER_URL}${report.reportedUserImage}`}
                                            alt="신고대상 프로필"
                                            style={{ width: 24, height: 24, borderRadius: '50%' }}
                                        />
                                        {report.reportedUserName}
                                    </div>
                                </td>
                                <td css={styles.td}>{report.reportedUserReportCount}</td>
                                <td css={styles.td}>{report.reportTarget}</td>
                                <td css={styles.td}>{report.reportReason}</td>
                                <td css={styles.td}>{new Date(report.createdAt).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {loading && <div style={{ textAlign: 'center', margin: 16 }}>로딩 중...</div>}
            {error && <div style={{ color: 'red', textAlign: 'center', margin: 16 }}>{error}</div>}
            {modalReport && (console.log('모달 렌더링:', modalReport), (
                <Modal onClick={() => setModalReport(null)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h2>신고 상세</h2>
                        <p><b>ID:</b> {modalReport.id}</p>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <p><b>신고자:</b></p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <img 
                                        src={`${import.meta.env.VITE_API_SERVER_URL}${modalReport.reporterImage}`}
                                        alt="신고자 프로필"
                                        style={{ width: 48, height: 48, borderRadius: '50%' }}
                                    />
                                    <div>
                                        <p>{modalReport.reporterName}</p>
                                        <p>신고횟수: {modalReport.reporterReportCount}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p><b>신고대상:</b></p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <img 
                                        src={`${import.meta.env.VITE_API_SERVER_URL}${modalReport.reportedUserImage}`}
                                        alt="신고대상 프로필"
                                        style={{ width: 48, height: 48, borderRadius: '50%' }}
                                    />
                                    <div>
                                        <p>{modalReport.reportedUserName}</p>
                                        <p>신고횟수: {modalReport.reportedUserReportCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p><b>신고유형:</b> {modalReport.reportTarget}</p>
                        <p><b>신고사유:</b> {modalReport.reportReason}</p>
                        <p><b>추가설명:</b> {modalReport.additionalComment}</p>
                        <p><b>신고일:</b> {new Date(modalReport.createdAt).toLocaleString()}</p>
                        <ButtonGroup>
                            <ActionButton variant="accept" onClick={() => setModalReport(null)}>확인</ActionButton>
                        </ButtonGroup>
                    </ModalContent>
                </Modal>
            ))}
        </div>
    )
}

export default ReportTable;