import TodoList from "./TodoList";
import React, { useState, useEffect, useRef, useCallback } from "react";

export default function Edit({
  todos,
  setTodos,
  title,
  setTitle,
  setFlashcards,
  flashcards,
}) {
  const inputRef = useRef();
  const titleRef = useRef();

  const [isEditing, setEditing] = useState(false);
  const [isChecklist, setChecklist] = useState(false);
  const [placeholder, setPlaceholder] = useState("Take a note...");

  const handleInput = (e) => {
    setEditing(true);
  };

  const handleCheck = () => {
    setEditing(true);
    setChecklist(true);
    inputRef.current.parentElement.style.border = "solid #d9d9d9";
    inputRef.current.parentElement.style.borderWidth = "0.1px 0";
    setPlaceholder("List item");
  };

  const handlePlusChange = useCallback(() => {
    const str = inputRef.current.innerText;
    inputRef.current.replaceChildren();
    setTodos((todos) => [
      ...todos,
      {
        id: todos.length,
        todo: str,
        completed: false,
      },
    ]);
  }, [setTodos]);

  useEffect(() => {
    const keyDownEventListner = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handlePlusChange();
      }
    };
    const ref = inputRef.current;
    if (isChecklist) {
      ref.addEventListener("keydown", keyDownEventListner, true);
    } else {
      ref.removeEventListener("keydown", keyDownEventListner, true);
    }

    return () => {
      ref.removeEventListener("keydown", keyDownEventListner, true);
    };
  }, [isChecklist, handlePlusChange]);

  function handleCloseClick(e) {
    setEditing(false);
    setChecklist(false);
    inputRef.current.parentElement.style = "";
    setTitle("");
    if (todos.length) {
      setTodos([]);
      setFlashcards((oldArrayOfFiles) => {
        return [
          ...oldArrayOfFiles,
          {
            index: oldArrayOfFiles.length,
            pinned: false,
            title: title,
            content: todos,
            checklist: true,
          },
        ];
      });
    }

    if (isChecklist && inputRef.current.innerText !== "") {
      inputRef.current.innerText = "";
    }

    if (!isChecklist && inputRef.current.innerText === "") {
      return;
    }

    if (!isChecklist) {
      let str = inputRef.current.innerText;
      inputRef.current.innerText = "";
      setFlashcards((oldArrayOfFiles) => {
        return [
          ...oldArrayOfFiles,
          {
            index: oldArrayOfFiles.length,
            title: title,
            content: str.split("\n"),
            checklist: false,
          },
        ];
      });
    }

    setPlaceholder("Take a note...");
  }

  useEffect(() => {
    localStorage.setItem("NOTES", JSON.stringify(flashcards));
  }, [flashcards]);

  return (
    <div
      className="row shadow-sm border rounded justify-content-center col-xxl-5 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xsm-4 mx-auto m-4"
      style={{ borderRadius: "0.5rem" }}
    >
      <div>
        {isEditing && (
          <div
            style={{
              width: "auto",
            }}
          >
            <input
              type="text"
              className="form-control shadow-none border-0"
              ref={titleRef}
              style={{ WebkitTextStroke: "0.02rem" }}
              placeholder={"Title"}
              value={title}
              onInput={function (e) {
                setTitle(e.target.value);
              }}
            />
          </div>
        )}

        <div
          className={
            isEditing && isChecklist
              ? "input-group py-0 mb-0 mt-2"
              : "input-group"
          }
        >
          {isEditing && isChecklist && (
            <span
              className="input-group-text border-0"
              style={{
                size: "auto",
                background: "white",
                padding: "6px 10px",
                marginLeft: "12px",
              }}
            >
              <i
                className="bi bi-plus h5 p-0 m-0"
                style={{ width: "20px", height: "20px" }}
                onClick={handlePlusChange}
              />
            </span>
          )}
          <div
            contentEditable="plaintext-only"
            placeholder={placeholder}
            style={{
              display: "flex",
              alignItems: "center",
              width: "auto",
              wordBreak: "break-all",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
            onClick={handleInput}
            className={
              !isChecklist
                ? "form-control input-box shadow-none border-0 px-3"
                : "form-control shadow-none border-0 m-0 p-0 list-font"
            }
            ref={inputRef}
            spellCheck="true"
            dir="ltr"
            onInput={handleInput}
          ></div>
          {!isEditing && (
            <div
              className="input-group-append"
              onMouseOver={(e) => {
                e.currentTarget.children[0].style.backgroundColor = "#e9eaea";
              }}
              onMouseOut={(e) => {
                e.currentTarget.children[0].style.backgroundColor = "white";
              }}
            >
              <span
                className="input-group-text border-0 rounded-circle"
                style={{
                  backgroundColor: "white",
                  padding: "12px",
                  margin: "1px",
                }}
              >
                <i
                  className="bi bi-check-square"
                  style={{ width: "22px", height: "22px" }}
                  onClick={handleCheck}
                />
              </span>
            </div>
          )}
        </div>
        <div className={isChecklist ? "pt-1 mt-1" : ""}>
          <TodoList todos={todos} setTodos={setTodos} />
        </div>
        {isEditing && (
          <div>
            <button
              className="btn btn-primary shadow-none float-end border-none"
              onClick={handleCloseClick}
              style={{
                fontFamily: "Roboto,Arial,sans-serif",
                color: "black",
                fontSize: "0.9rem",
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
