import { useEffect, useState } from "react";
import NavigationComponent from "../../components/Navigation/NavigationComponent";
import {
    PaymentsContainer, PaymentsContent, HeadText,
    Form, InputGroup, Label, TextInput, Checkbox, SubmitButton,
    ProductsTable, TableHeader, TableCell,
    Modal, ModalContent, ButtonGroup, ActionButton
} from "./PaymentsStyles";
import { fetchWithRefresh } from '../../utils/fetchWithRefresh';

interface PaymentProduct {
    id: number;
    productId: number;
    points: number;
    amount: number;
    isPromotion: boolean;
    promotionPeriod: string | null;
    active: boolean;
}

const initialForm = {
    points: 0,
    amount: 0,
    isPromotion: false,
    promotionStart: "",
    promotionEnd: "",
};

const Payments = () => {
    const [products, setProducts] = useState<PaymentProduct[]>([]);
    const [form, setForm] = useState(initialForm);
    const [modalProduct, setModalProduct] = useState<PaymentProduct | null>(null);
    const [editForm, setEditForm] = useState(initialForm);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/products`);
        const data = await res.json();
        setProducts(data);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                points: Number(form.points),
                amount: Number(form.amount),
                promotionPeriod: form.isPromotion && form.promotionStart && form.promotionEnd
                    ? `${form.promotionStart}~${form.promotionEnd}`
                    : null,
            }),
        });
        setForm(initialForm);
        fetchProducts();
    };

    const handleEdit = (product: PaymentProduct) => {
        setModalProduct(product);
        const [start = '', end = ''] = (product.promotionPeriod || '').split('~');
        setEditForm({
            points: product.points,
            amount: product.amount,
            isPromotion: product.isPromotion,
            promotionStart: start,
            promotionEnd: end,
        });
    };

    const handleUpdate = async () => {
        if (!modalProduct) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/products/${modalProduct.productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...editForm,
                points: Number(editForm.points),
                amount: Number(editForm.amount),
                promotionPeriod: editForm.isPromotion && editForm.promotionStart && editForm.promotionEnd
                    ? `${editForm.promotionStart}~${editForm.promotionEnd}`
                    : null,
            }),
        });
        setModalProduct(null);
        fetchProducts();
    };

    const handleDelete = async () => {
        if (!modalProduct) return;
        await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/admin/products/${modalProduct.productId}`, {
            method: 'DELETE',
        });
        setModalProduct(null);
        fetchProducts();
    };

    return (
        <PaymentsContainer>
            <NavigationComponent />
            <PaymentsContent>
                <HeadText>결제관리</HeadText>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label>포인트</Label>
                        <TextInput name="points" type="number" value={form.points} onChange={handleFormChange} required />
                    </InputGroup>
                    <InputGroup>
                        <Label>금액(원)</Label>
                        <TextInput name="amount" type="number" value={form.amount} onChange={handleFormChange} required />
                    </InputGroup>
                    <InputGroup>
                        <Label>
                            <Checkbox name="isPromotion" type="checkbox" checked={form.isPromotion} onChange={handleFormChange} />
                            프로모션 여부
                        </Label>
                    </InputGroup>
                    {form.isPromotion && (
                        <InputGroup>
                            <Label>프로모션 시작일</Label>
                            <TextInput name="promotionStart" type="date" value={form.promotionStart} onChange={handleFormChange} />
                            <Label>프로모션 종료일</Label>
                            <TextInput name="promotionEnd" type="date" value={form.promotionEnd} onChange={handleFormChange} />
                        </InputGroup>
                    )}
                    <SubmitButton type="submit">상품 등록</SubmitButton>
                </Form>
                <ProductsTable>
                    <thead>
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>포인트</TableHeader>
                            <TableHeader>금액</TableHeader>
                            <TableHeader>프로모션</TableHeader>
                            <TableHeader>프로모션 기간</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} style={{ cursor: 'pointer' }} onClick={() => handleEdit(product)}>
                                <TableCell>{product.productId}</TableCell>
                                <TableCell>{product.points}</TableCell>
                                <TableCell>{product.amount.toLocaleString()}원</TableCell>
                                <TableCell>{product.isPromotion ? 'Y' : 'N'}</TableCell>
                                <TableCell>{product.promotionPeriod || '-'}</TableCell>
                            </tr>
                        ))}
                    </tbody>
                </ProductsTable>
                {modalProduct && (
                    <Modal onClick={() => setModalProduct(null)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <h2>상품 상세/수정</h2>
                            <InputGroup>
                                <Label>포인트</Label>
                                <TextInput name="points" type="number" value={editForm.points} onChange={handleEditFormChange} required />
                            </InputGroup>
                            <InputGroup>
                                <Label>금액(원)</Label>
                                <TextInput name="amount" type="number" value={editForm.amount} onChange={handleEditFormChange} required />
                            </InputGroup>
                            <InputGroup>
                                <Label>
                                    <Checkbox name="isPromotion" type="checkbox" checked={editForm.isPromotion} onChange={handleEditFormChange} />
                                    프로모션 여부
                                </Label>
                            </InputGroup>
                            {editForm.isPromotion && (
                                <InputGroup>
                                    <Label>프로모션 시작일</Label>
                                    <TextInput name="promotionStart" type="date" value={editForm.promotionStart} onChange={handleEditFormChange} />
                                    <Label>프로모션 종료일</Label>
                                    <TextInput name="promotionEnd" type="date" value={editForm.promotionEnd} onChange={handleEditFormChange} />
                                </InputGroup>
                            )}
                            <ButtonGroup>
                                <ActionButton variant="accept" onClick={handleUpdate}>수정</ActionButton>
                                <ActionButton variant="reject" onClick={handleDelete}>삭제</ActionButton>
                            </ButtonGroup>
                        </ModalContent>
                    </Modal>
                )}
            </PaymentsContent>
        </PaymentsContainer>
    );
};

export default Payments;