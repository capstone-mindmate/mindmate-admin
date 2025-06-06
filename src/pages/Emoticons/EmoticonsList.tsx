import { useState, useEffect } from 'react';
import { 
    EmoticonsContainer, 
    EmoticonContent, 
    HeadText, 
    EmoticonTable,
    TableHeader,
    TableCell,
} from "./EmoticonsStyles";
import NavigationComponent from "../../components/Navigation/NavigationComponent";
import { fetchWithRefresh } from '../../utils/fetchWithRefresh';


interface Emoticon {
    id: number;
    imageUrl: string;
    name: string;
    price: number;
    fileSize: number;
}


const EmoticonsList = () => {
    const [emoticons, setEmoticons] = useState<Emoticon[]>([]);

    useEffect(() => {
        const fetchEmoticons = async () => {
            const response = await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/emoticons/popular/viewed?limit=100`);
            const data = await response.json();
            setEmoticons(data);
        };
        fetchEmoticons();

    }, []);

    return (
        <EmoticonsContainer>
            <NavigationComponent />
            <EmoticonContent>
                <HeadText>이모티콘 목록</HeadText>

                <EmoticonTable>
                    <thead>
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>이미지</TableHeader>
                            <TableHeader>이름</TableHeader>
                            <TableHeader>가격</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {emoticons.length > 0 ? emoticons.map((emoticon) => (
                            <tr key={emoticon.id}>
                                <TableCell>{emoticon.id}</TableCell>
                                <TableCell>
                                    <img 
                                        src={`${import.meta.env.VITE_API_LOCAL_URL}` + emoticon.imageUrl} 
                                        alt={`이모티콘 ${emoticon.id}`}
                                        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                    />
                                </TableCell>
                                <TableCell>{emoticon.name}</TableCell>
                                <TableCell>{emoticon.price.toLocaleString()}코인</TableCell>
                            </tr>
                        )) : <tr><TableCell colSpan={4} style={{ textAlign: 'center' }}>등록된 이모티콘이 없습니다.</TableCell></tr>}
                    </tbody>
                </EmoticonTable>
            </EmoticonContent>
        </EmoticonsContainer>
    );
};

export default EmoticonsList;
