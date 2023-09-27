import Todo from "./Todo";
export default function TodoList({ todos, setTodos }) {
    return (
        <div>
            {
                todos.map((todo) => {
                    return <Todo todo={todo} todos={todos} setTodos={setTodos} key={todo.id} />;
                })
            }
        </div>
    );
}
