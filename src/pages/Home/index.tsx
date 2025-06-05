import { useEffect } from "react"



export default function Home() {

    useEffect(() => {
        console.log('Home')
    }, [])

    return <div>Home</div>
}