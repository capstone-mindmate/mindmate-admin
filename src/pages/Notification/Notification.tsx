import { useState } from "react";
import { NotificationContainer, NotificationContent, HeadText } from "./NotificationStyles";
import NavigationComponent from "../../components/Navigation/NavigationComponent";
import { fetchWithRefresh } from '../../utils/fetchWithRefresh';
import { Form, InputGroup, Label, TextInput, SubmitButton, ResultMessage } from "./NotificationStyles";

const Notification = () => {
    const [form, setForm] = useState({ title: "", announcementId: "" });
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/notifications/announcement`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title,
                    announcementId: form.announcementId
                }),
            });
            if (res.ok) {
                setResult({ success: true, message: "알림이 성공적으로 전송되었습니다." });
            } else {
                const data = await res.json();
                setResult({ success: false, message: data?.message || "알림 전송에 실패했습니다." });
            }
        } catch {
            setResult({ success: false, message: "알림 전송 중 오류가 발생했습니다." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <NotificationContainer>
            <NavigationComponent />
            <NotificationContent>
                <HeadText>공지알림 전송</HeadText>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label>제목</Label>
                        <TextInput
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>공지사항 ID</Label>
                        <TextInput
                            name="announcementId"
                            value={form.announcementId}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? "전송 중..." : "알림 전송"}
                    </SubmitButton>
                </Form>
                {result && (
                    <ResultMessage success={result.success}>{result.message}</ResultMessage>
                )}
            </NotificationContent>
        </NotificationContainer>
    );
};

export default Notification;