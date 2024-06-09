import { useQuery } from "@tanstack/react-query";
import { CACHE_KEY__TODOS } from "../constants";
import APIClient from "../services/apiClient";

const apiClient = new APIClient<Todo>('/todos');

export interface Todo {
    id: number;
    title: string;
    userId: number;
    completed: boolean;
}

const useTodos = () => {

    return useQuery<Todo[], Error>({
        queryKey: CACHE_KEY__TODOS,
        queryFn: apiClient.getAll,
        staleTime: 10 * 1000, // 10 seconds
    })

}

export default useTodos