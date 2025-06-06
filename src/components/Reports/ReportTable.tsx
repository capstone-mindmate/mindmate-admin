/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { useEffect, useState } from 'react'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

interface Report {
    userId: string;
    email: string;
    nickname: string;
    suspensionReason: string;
    reportCount: number;
    suspensionEndTime: string;
}

const styles = {
    table: css`
        width: 90%;
        border-collapse: collapse;
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
    `
}

const ReportTable = () => {
    const [reports, setReports] = useState<Report[]>([])

    useEffect(() => {

        const fetchUsers = async () => {
            const response = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/users/suspended`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json()
            setReports(data)
        }

        fetchUsers()

        console.log(reports)
    }, [])



    return (
        <table css={styles.table}>
            <thead>
                <tr>
                    <th css={styles.th}>ID</th>
                    <th css={styles.th}>이메일</th>
                    <th css={styles.th}>닉네임</th>
                    <th css={styles.th}>신고사유</th>
                    <th css={styles.th}>신고횟수</th>
                    <th css={styles.th}>정지 종료일</th>
                    <th css={styles.th}>비고</th>
                </tr>
            </thead>
            <tbody>
                {reports.length === 0 ? (
                    <tr>
                        <td colSpan={7} css={styles.td}>데이터가 없습니다.</td>
                    </tr>
                ) : (
                    reports.map((report) => (
                        <tr>
                            <td css={styles.td}>{report.userId}</td>
                            <td css={styles.td}>{report.email}</td>
                            <td css={styles.td}>{report.nickname}</td>
                            <td css={styles.td}>{report.suspensionReason}</td>
                            <td css={styles.td}>{report.reportCount}</td>
                            <td css={styles.td}>{report.suspensionEndTime}</td>
                            <td css={styles.td}>나중에버튼</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    )
}

export default ReportTable;