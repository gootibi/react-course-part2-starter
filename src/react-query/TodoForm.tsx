import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRef } from 'react';
import { Todo } from './hooks/useTodos';

interface AddTodoContext {
  previusTodos: Todo[];
}

const TodoForm = () => {

  const queryClient = useQueryClient()

  const addTodo = useMutation<Todo, Error, Todo, AddTodoContext>({

    mutationFn: (todo: Todo) =>
      axios
        .post<Todo>('https://jsonplaceholder.typicode.com/todos', todo)
        .then(response => response.data),

    onMutate: (newTodo: Todo) => {

      const previusTodos = queryClient.getQueryData<Todo[]>(['todos']) || [];

      // APPROACH: Updating the data in the cache
      queryClient.setQueryData<Todo[]>(['todos'], todos => [newTodo, ...(todos || [])])

      if (ref.current) {
        ref.current.value = '';
      }

      return { previusTodos };
    },

    onSuccess: (saveTodo, newTodo) => {
      queryClient.setQueryData<Todo[]>(['todos'], todos =>
        todos?.map(todo =>
          todo === newTodo ? saveTodo : todo
        )
      )
    },

    onError: (error, newTodo, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData<Todo[]>(['todos'], context.previusTodos)
    }

  });

  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      {addTodo.error && (<div className="alert alert-danger">
        {addTodo.error.message}
      </div>)}

      <form className="row mb-3" onSubmit={(event) => {
        event.preventDefault();

        if (ref.current && ref.current.value) {
          addTodo.mutate({
            id: 0,
            title: ref.current?.value,
            completed: false,
            userId: 1
          });
        }

      }}>
        <div className="col">
          <input ref={ref} type="text" className="form-control" />
        </div>
        <div className="col">
          <button disabled={addTodo.isLoading} className="btn btn-primary">
            {addTodo.isLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </>
  );
};

export default TodoForm;
