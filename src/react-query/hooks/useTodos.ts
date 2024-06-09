import { useQuery } from "@tanstack/react-query";
import { CACHE_KEY__TODOS } from "../constants";
import todoServices, { Todo } from "../services/todoServices";

const useTodos = () => {

    return useQuery<Todo[], Error>({
        queryKey: CACHE_KEY__TODOS,
        queryFn: todoServices.getAll,
        staleTime: 10 * 1000, // 10 seconds
    })

}

export default useTodos