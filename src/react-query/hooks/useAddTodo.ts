import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY__TODOS } from "../constants";
import APIClient from "../services/apiClient";
import { Todo } from "./useTodos";

const apiClient = new APIClient<Todo>('/todos');

interface AddTodoContext {
    previusTodos: Todo[];
}

const useAddTodo = (onAdd: () => void) => {
    const queryClient = useQueryClient()

    return useMutation<Todo, Error, Todo, AddTodoContext>({

        mutationFn: apiClient.post,

        onMutate: (newTodo: Todo) => {

            const previusTodos = queryClient.getQueryData<Todo[]>(CACHE_KEY__TODOS) || [];

            // APPROACH: Updating the data in the cache
            queryClient.setQueryData<Todo[]>(CACHE_KEY__TODOS, (todos = []) => [newTodo, ...todos])

            onAdd();

            return { previusTodos };
        },

        onSuccess: (saveTodo, newTodo) => {
            queryClient.setQueryData<Todo[]>(CACHE_KEY__TODOS, todos =>
                todos?.map(todo =>
                    todo === newTodo ? saveTodo : todo
                )
            )
        },

        onError: (error, newTodo, context) => {
            if (!context) {
                return;
            }

            queryClient.setQueryData<Todo[]>(CACHE_KEY__TODOS, context.previusTodos)
        }

    });
}

export default useAddTodo