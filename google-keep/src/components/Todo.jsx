import { useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
export default function Todo({ todo, todos, setTodos }) {
    const inputRef = useRef();
    const [check, setCheck] = useState(false);
    const trash = () => {
        setTodos(todos.filter(el => el.id !== todo.id));
    };

    const updateTodo = (id, updatedTodo) => {
        setTodos(prevTodos => prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)));
    };

    const handleChange = (e) => {
        setCheck(!check);
        const updatedTodo = { ...todo, completed: e.target.checked };
        updateTodo(todo.id, updatedTodo);
    };



    return (
        <li className="list label text" draggable type="none">
            <span className="move white" style={{ display: "block" }}><i className="bi bi-three-dots-vertical move h5" style={{ marginLeft: "-1rem", marginRight: "-2rem" }}></i><i className="bi bi-three-dots-vertical move h5" style={{ marginLeft: "1.1rem", marginRight: "0rem" }}></i></span>
            <span className="flashcard-option" key={uuidv4()} type="none" style={{
                backgroundColor: "e9eaea",
                display: "flex", verticalAlign: "middle",
                flexWrap: "wrap",
                alignContent: "center",
                height: "24px"
            }}>
                <input className="shadow-none" ref={inputRef} key={uuidv4} type="checkbox" defaultChecked={check || false} style={{ border: "1px solid #7f7f7f", cursor: "pointer", color: "#bfbfbf" }} onChange={handleChange} />

            </span>

            < div className="flashcard-option" key={uuidv4()} type="none" style={{
                marginRight: "auto",
                float: "left"
            }}>
                <div contentEditable="true" suppressContentEditableWarning role="checkbox" defaultChecked={check || false} className={"edit-list form-control shadow-none border-0 bg-transparent fmy-0 py-0".concat(check ? " completed text-secondary" : "")} style={{ paddingLeft: "12px" }} type="text"
                    onChange={(e) => {
                        const updatedTodo = { ...todo, todo: e.target.value };
                        updateTodo(todo.id, updatedTodo);
                    }} >
                    {todo.todo}
                </div>
            </div>

            <span className="input-group-text cross border-0 bg-transparent m-0 p-0" style={{
                backgroundColor: "e9eaea"
            }}>
                <i className="bi bi-x hover-dark h4 p-0 m-0" style={{ display: "inline-block", cursor: "pointer", float: "right" }} onClick={trash} ></i>
            </span>
        </li >
    );
}