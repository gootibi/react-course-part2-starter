import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CACHE_KEY__TODOS } from "../constants";

export interface Todo {
    id: number;
    title: string;
    userId: number;
    completed: boolean;
}

const useTodos = () => {
    const fetchTodos = () =>
        axios
            .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
            .then(res => res.data)

    return useQuery<Todo[], Error>({
        queryKey: CACHE_KEY__TODOS,
        queryFn: fetchTodos,
        staleTime: 10 * 1000, // 10 seconds
    })
}

export default useTodos