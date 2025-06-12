/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { useEffect, useState } from 'react'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

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

interface User {
    userId: string;
    email: string;
    nickname: string;
    suspensionReason: string;
    reportCount: number;
    suspensionEndTime: string;
}

const UserTable = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    const fetchUsers = async () => {
        setLoading(true)
        const response = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/users/suspended`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json()
        setUsers(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchUsers()
        // eslint-disable-next-line
    }, [])

    const handleUnsuspend = async (userId: string) => {
        const input = window.prompt('정지 해제 후 신고 횟수를 입력하세요. (숫자)', '0')
        if (input === null) return
        const reportCount = parseInt(input, 10)
        if (isNaN(reportCount) || reportCount < 0) {
            alert('올바른 숫자를 입력하세요.')
            return
        }
        try {
            await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/users/${userId}/unsuspend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportCount })
            })
            alert('정지 해제 완료')
            fetchUsers()
        } catch {
            alert('정지 해제에 실패했습니다.')
        }
    }

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
                {loading ? (
                    <tr><td colSpan={7} css={styles.td}>로딩 중...</td></tr>
                ) : users.length === 0 ? (
                    <tr>
                        <td colSpan={7} css={styles.td}>데이터가 없습니다.</td>
                    </tr>
                ) : (
                    users.map((user) => (
                        <tr key={user.userId}>
                            <td css={styles.td}>{user.userId}</td>
                            <td css={styles.td}>{user.email}</td>
                            <td css={styles.td}>{user.nickname}</td>
                            <td css={styles.td}>{user.suspensionReason}</td>
                            <td css={styles.td}>{user.reportCount}</td>
                            <td css={styles.td}>{user.suspensionEndTime}</td>
                            <td css={styles.td}>
                                <button onClick={() => handleUnsuspend(user.userId)} style={{ padding: '6px 12px', borderRadius: 4, background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
                                    정지해제
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    )
}

export default UserTable;