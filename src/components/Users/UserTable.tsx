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

    useEffect(() => {

        const fetchUsers = async () => {
            const response = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/users/suspended`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json()
            setUsers(data)
        }

        fetchUsers()

        console.log(users)
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
                {users.length === 0 ? (
                    <tr>
                        <td colSpan={7} css={styles.td}>데이터가 없습니다.</td>
                    </tr>
                ) : (
                    users.map((user) => (
                        <tr>
                            <td css={styles.td}>{user.userId}</td>
                            <td css={styles.td}>{user.email}</td>
                            <td css={styles.td}>{user.nickname}</td>
                            <td css={styles.td}>{user.suspensionReason}</td>
                            <td css={styles.td}>{user.reportCount}</td>
                            <td css={styles.td}>{user.suspensionEndTime}</td>
                            <td css={styles.td}>나중에 버튼</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    )
}

export default UserTable;