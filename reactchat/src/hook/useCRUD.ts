import useAxiosWithInterceptor from "../helpers/jwtinterceptor"
import { BASE_URL } from "../config"
import { useState } from "react"

interface IuseCRUD<T> {
    dataCRUD: T[]
    error: Error | null
    isLoading: boolean
    fetchData: () => Promise<void>
}

const useCRUD = <T>(initalData: T[], apiURL: string): IuseCRUD<T> => {
    const jwtAxios = useAxiosWithInterceptor()
    const [dataCRUD, setDataCRUD] = useState<T[]>(initalData)
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            // await new Promise(resolve => setTimeout(resolve, 5000))
            const response = await jwtAxios.get(`${BASE_URL}${apiURL}`, {})
            const data = response.data
            setDataCRUD(data)
            setError(null)
            setIsLoading(false)
            return data
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                setError(new Error("400"))
            }
            setIsLoading(false)
            throw error
        }
    }
    return { fetchData, dataCRUD, error, isLoading }
}

export default useCRUD