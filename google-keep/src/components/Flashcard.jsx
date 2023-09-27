import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";

export default function Flashcard({
  flashcard,
  flashcards,
  setFlashcards,
  toggle,
  setTodos,
}) {
  const [placeholder, setPlaceholder] = useState("");
  const footerRef = useRef();
  const inputRef = useRef();
  const cardHeaderRef = useRef();
  const titleRef = useRef();
  const bodyRef = useRef();
  const modalRef = useRef();
  const dialogRef = useRef();
  const dragRef = useRef();
  const dropRef = useRef();
  const threedotRef = useRef();
  const badgeRef = useRef();
  const pinRef = useRef();
  const pinnedRef = useRef();
  const [pinHover, setPinHover] = useState(false);
  const FLASHCARD = "flashcard";
  const ACCEPTS = [FLASHCARD];
  const [, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      let flashcardsCopy = [...flashcards];
      const arr = flashcardsCopy.splice(flashcard.index, 1, {
        index: flashcard.index,
        title: item.title,
        content: item.content,
        checklist: item.checklist,
      });
      flashcardsCopy.splice(item.index, 1, {
        index: item.index,
        title: arr[0].title,
        content: arr[0].content,
        checklist: arr[0].checklist,
      });
      setFlashcards(flashcardsCopy);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [, drag] = useDrag({
    type: FLASHCARD,
    item: {
      index: flashcard.index,
      title: flashcard.title,
      content: flashcard.content,
      checklist: flashcard.checklist,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    localStorage.setItem("NOTES", JSON.stringify(flashcards));
    if (titleRef.current && titleRef.current.textContent === "") {
      setPlaceholder("Empty note");
    }
  }, [flashcards]);

  drag(dragRef);
  drop(dropRef);

  const handleMouseOver = (e) => {
    e.preventDefault();
    if (threedotRef && threedotRef.current) {
      threedotRef.current.style.color = "";
    }

    if (pinRef && pinRef.current) {
      pinRef.current.style.color = "";
    }

    if (pinnedRef && pinnedRef.current && !pinHover) {
      pinnedRef.current.style.color = "#757575";
    }

    if (badgeRef && badgeRef.current) {
      badgeRef.current.style.display = "block";
    }

    if (!e.currentTarget.classList.contains("border-0")) {
      dropRef.current.style.translateY = "-2px";
      dropRef.current.style.boxShadow = "0 0 5px 2px rgb(224, 224, 224, 0.5)";
    }
  };

  const handleMouseOut = (e) => {
    e.preventDefault();

    if (threedotRef && threedotRef.current) {
      threedotRef.current.style.color = "white";
    }

    if (pinRef && pinRef.current) {
      pinRef.current.style.color = "white";
    }

    if (pinnedRef && pinnedRef.current) {
      pinnedRef.current.style.color = "white";
    }

    if (
      badgeRef &&
      badgeRef.current &&
      !("border: 1px solid black" in badgeRef.current.style)
    ) {
      badgeRef.current.style.display = "none";
    }

    dropRef.current.style.translateY = "";
    dropRef.current.style.boxShadow = "";
  };

  const deleteTask = (e) => {
    const str = e.currentTarget.parentElement.children[2].textContent;
    const array = [...flashcards.map((value) => value.content)];
    const res = array.map((arr) =>
      arr.map((arr2) => (arr2.todo === undefined ? "-" : arr2.todo))
    );
    const index = res.findIndex((_) => _.includes(str));
    const id = flashcards[index].content.findIndex((el) => el.todo === str);
    const arr1 = flashcards[index].content;
    let arr;
    if (arr1.length - 1) {
      const dup_arr = [...arr1];
      dup_arr.splice(id);

      let temp = [...arr1];
      temp.splice(0, id + 1);

      let dup_arr2 = [...temp].map((el) => {
        el.id = el.id - 1;
        return el;
      });

      arr = [...dup_arr, ...dup_arr2];
    } else {
      arr = [];
    }

    setFlashcards((flashes) =>
      flashes.map((f) => {
        if (f.index === index) {
          f.content = arr;
        }
        return f;
      })
    );
  };

  const handleMouseOut2 = (e) => {
    setPinHover(false);
    e.currentTarget.style.backgroundColor = "white";
  };

  const handleMouseOver2 = (e) => {
    setPinHover(true);
    e.currentTarget.style.backgroundColor = "#e9eaea";
    e.currentTarget.children[0].style.color = "black";
  };

  const deleteNote = () => {
    let arr = [...flashcards];
    arr.splice(flashcard.index, flashcard.index + 1);
    arr = arr.map((el) => {
      const b = JSON.parse(JSON.stringify(el));
      if (b.index > flashcard.index) {
        b.index -= 1;
      }
      return b;
    });

    setFlashcards([...arr]);
  };

  const makeCopy = () => {
    let arr = [...flashcards];
    let arr2 = arr.splice(flashcard.index);
    arr2 = [...flashcards].splice(flashcard.index).map((el) => {
      const b = JSON.parse(JSON.stringify(el));
      b.index += 1;
      return b;
    });
    setFlashcards([...arr, flashcards[flashcard.index], ...arr2]);
  };

  const $ = (el) => {
    return document.getElementById(el);
  };

  function recreateNode(el, withChildren) {
    if (withChildren) {
      const cloned = el.cloneNode(true);
      el.parentNode.replaceChild(cloned, el);
      cloned.children[1].children[0].addEventListener("change", handleChange);
      cloned.children[2].children[0].addEventListener(
        "input",
        handleInputChange
      );
    } else {
      var newEl = el.cloneNode(false);
      while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
      el.parentNode.replaceChild(newEl, el);
    }
  }

  let arr;
  function handleInputChange(e) {
    const str = e.target.textContent;
    const title = titleRef.current.textContent;
    const index = [...flashcards].findIndex((el) => el.title === title);
    const children = e.currentTarget.closest("ul").children;
    const child = e.currentTarget.closest("li");

    const id = Array.from(children).findIndex((el) => el === child);
    arr = flashcards.map((flashcard) => {
      if (flashcard.index === index) {
        flashcard.content.map((el) => {
          if (el.id === id) {
            el.todo = str;
          }
          return el;
        });
      }
      return flashcard;
    });
  }

  function handleChange(e) {
    let completed;
    if (e.currentTarget.checked) {
      completed = true;
      e.currentTarget.parentElement.nextElementSibling.children[0].classList.add(
        "text-secondary"
      );
      e.currentTarget.parentElement.nextElementSibling.children[0].classList.add(
        "completed"
      );
    } else {
      completed = false;
      e.currentTarget.parentElement.nextElementSibling.children[0].classList.remove(
        "text-secondary"
      );
      e.currentTarget.parentElement.nextElementSibling.children[0].classList.remove(
        "completed"
      );
    }

    const index = Array.from(document.getElementsByClassName("card")).findIndex(
      (el) => el === e.currentTarget.closest(".card")
    );
    const children = e.currentTarget.closest("ul").children;
    const child = e.currentTarget.closest("li");

    const id = Array.from(children).findIndex((el) => el === child);
    arr = flashcards.map((flashcard) => {
      if (flashcard.index === index) {
        flashcard.content.map((el) => {
          if (el.id === id) {
            el.completed = completed;
          }
          return el;
        });
      }
      return flashcard;
    });
    setFlashcards(arr);
  }

  function handleContentChange(e) {
    const str = e.target.textContent;
    const title = titleRef.current.textContent;
    const index = [...flashcards].findIndex((el) => el.title === title);
    arr = flashcards.map((flashcard) => {
      if (flashcard.index === index) {
        flashcard.content[0] = str;
      }
      return flashcard;
    });
  }

  function handleTitleInput(e) {
    const title = titleRef.current.textContent;
    const child = document.getElementById("exampleModal").parentElement;
    const children = Array.from(document.getElementsByClassName("card"));

    const index = children.findIndex((el) => el === child);
    arr = flashcards.map((flashcard) => {
      if (flashcard.index === index) {
        flashcard.title = title;
      }
      return flashcard;
    });
  }

  function setCaratTo(contentEditableElement, position) {
    var range, selection;
    if (document.createRange) {
      range = document.createRange();
      range.selectNodeContents(contentEditableElement);

      range.setStart(contentEditableElement.firstChild, position);
      range.setEnd(contentEditableElement.firstChild, position);

      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

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

  return (
    <div
      key={flashcard.index}
      ref={dropRef}
      className="card"
      style={toggle ? { margin: "1rem 0rem" } : { margin: "1rem 0.5rem" }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      draggable
      onClick={(e) => {
        const cl = ["myform-input", "threedots", "pin"];
        const list = e.target.classList;

        if (!cl.some((c) => list.contains(c))) {
          titleRef.current.contentEditable = "plaintext-only";
          setPlaceholder("Note");
          dropRef.current.classList.add("border-0");
          dropRef.current.click();
          dropRef.current.style.width = dragRef.current.width;
          dragRef.current.removeAttribute("draggable");
          modalRef.current.setAttribute("id", "exampleModal");
          modalRef.current.setAttribute("aria-labelledby", "exampleModalLabel");
          modalRef.current.setAttribute("aria-hidden", "true");

          dialogRef.current.classList.add("modal-dialog");
          dialogRef.current.classList.add("modal-dialog-scrollable");
          dialogRef.current.classList.add("modal-lg");
          dialogRef.current.classList.add("modal-dialog-centered");

          dropRef.current.setAttribute("data-bs-target", "#exampleModal");
          dropRef.current.setAttribute("data-bs-toggle", "modal");

          dragRef.current.classList.add("modal-content");

          modalRef.current.classList.add("modal");
          titleRef.current.classList.remove("list-title");
          titleRef.current.classList.add("list-title-active");
          cardHeaderRef.current.style.marginBottom = "12px";

          const list = bodyRef.current.children[1];
          list.style.whiteSpace = "pre-wrap";
          list.classList.add("modal-body");

          const handleMouseEnter = (e) => {
            e.preventDefault();
            e.target.children[0].classList.remove("white");
            e.target.children[0].children[0].classList.remove("white");
            e.target.children[0].children[1].classList.remove("white");
            e.target.children[0].style.display = "block";
            const cross = e.target.children[3].children[0];
            cross.style.display = "block";
          };
          const handleMouseLeave = (e) => {
            e.preventDefault();
            e.target.children[0].classList.add("white");
            e.target.children[0].children[0].classList.add("white");
            e.target.children[0].children[1].classList.add("white");
            e.target.children[0].style.display = "none";
            const cross = e.target.children[3].children[0];
            cross.style.display = "none";
          };

          const handleClose = (e) => {
            if (arr) {
              setFlashcards(arr);
            }
            if (titleRef.current && titleRef.current.textContent === "") {
              setPlaceholder("Empty note");
            } else {
              setPlaceholder("");
            }
            titleRef.current.contentEditable = "false";
            dropRef.current.classList.remove("border-0");
            list.style.whiteSpace = "";
            cardHeaderRef.current.style.marginBottom = "0";
            titleRef.current.classList.remove("list-title-active");
            titleRef.current.classList.add("list-title");

            if (list.children[1]) {
              if (list.children[1].children.length) {
                [].slice.call(list.children).forEach((el) => {
                  const description = el.children[2].children[0];
                  description.contentEditable = false;
                  description.classList.add("auto");
                  const move = el.children[0];
                  move.style.display = "none";
                  const cross = el.children[3].children[0];
                  cross.style.display = "none";

                  el.classList.remove("list-active");
                  el.classList.remove("label");
                  el.classList.add("list");
                  el.removeEventListener("click", () => {
                    el.children[1].click();
                  });

                  if (!el.children[0].children[0].classList.contains("white")) {
                    el.children[0].children[0].classList.add("white");
                    el.children[0].children[1].classList.add("white");
                  }

                  recreateNode(el, true);
                });
              }
            }

            dragRef.current.setAttribute("draggable", "true");

            modalRef.current.removeAttribute("id");
            modalRef.current.removeAttribute("aria-labelledby");
            modalRef.current.removeAttribute("aria-hidden");

            dialogRef.current.classList = "";

            dropRef.current.removeAttribute("data-bs-target");
            dropRef.current.removeAttribute("data-bs-toggle");

            dragRef.current.classList.remove("modal-content");
            modalRef.current.classList.remove("modal");
            modalRef.current.classList = "";
            dropRef.current.children[0].style.display = "block";

            document.body.classList = "";
            document.body.style = "";
            if (document.getElementsByClassName("modal-backdrop")[0]) {
              document.getElementsByClassName("modal-backdrop")[0].remove();
            }

            if ($("myButton")) {
              $("myButton").remove();
            }

            list.setAttribute("contentEditable", "false");
            list.classList.remove("modal-body");
            list.style.overflowY = "hidden";
            footerRef.current.children[0].setAttribute("disabled", "true");
            threedotRef.current.style.display = "block";
            threedotRef.current.removeAttribute("disabled");
            footerRef.current.children[0].removeAttribute("disabled");
          };

          threedotRef.current.style.display = "none";
          threedotRef.current.setAttribute("disabled", "true");
          footerRef.current.children[0].setAttribute("disabled", "true");
          console.log(list.children);

          if (list.children[1]) {
            if (list.children[1].children.length) {
              [].slice.call(list.children).forEach((el) => {
                el.children[0].removeAttribute("disabled");

                const description = el.children[2].children[0];
                const checkbox = el.children[1].children[0];
                console.log(description);

                if (el.children[0]) {
                  checkbox.removeAttribute("disabled");
                  description.contentEditable = true;
                  description.addEventListener("focus", (e) => {
                    setCaratTo(description, description.textContent.length);
                  });

                  el.addEventListener("click", (e) => {
                    description.focus();
                  });
                  el.classList.add("list-active");
                  el.classList.add("label");
                  el.classList.add("text");

                  el.addEventListener("mouseenter", handleMouseEnter);
                  el.addEventListener("mouseleave", handleMouseLeave);
                }
              });
            }
          }

          if (footerRef.current.innerHTML.includes("myButton")) {
            $("myButton").style.display = "block";
            $("myButton").removeAttribute("disabled");
          } else {
            const button = document.createElement("button");
            button.setAttribute("id", "myButton");
            button.setAttribute(
              "style",
              "font-family: Roboto, Arial, sans-serif; color: black; font-size: 0.9rem;"
            );
            button.setAttribute("data-bs-dismiss", "modal");
            button.classList +=
              "btn btn-primary shadow-none float-end border-none";
            button.addEventListener("click", handleClose);

            button.textContent = "Close";
            footerRef.current.append(button);

            if (!e.currentTarget.innerHTML.includes("myform-input")) {
              list.contentEditable = "plaintext-only";
              list.style.overflowY = "auto";
            }

            document.body.addEventListener("keydown", (e) => {
              if (e.key === "Escape") {
                button.click();
              }
            });
          }

          e.currentTarget.click();
        }
      }}
    >
      <div ref={modalRef}>
        <div ref={dialogRef}>
          <div className="shadow-none" ref={dragRef}>
            <div
              className="card-header border-0 m-0 pb-0"
              style={{
                backgroundColor: "white",
                marginTop: "12px",
                marginBottom: "0",
                marginLeft: "1rem",
                marginRight: "1rem",
              }}
              ref={cardHeaderRef}
            >
              <div
                contentEditable="false"
                suppressContentEditableWarning={true}
                title="Title"
                className="card-title list-title m-0 shadow-none input-box"
                onInput={handleTitleInput}
                ref={titleRef}
              >
                {flashcard.title}
              </div>
              <button
                className="btn border-0 p-0 rounded-circle pin-holder pin"
                contentEditable="false"
                suppressContentEditableWarning={true}
                onMouseOver={handleMouseOver2}
                onMouseOut={handleMouseOut2}
              >
                {flashcard.pinned && (
                  <i
                    className="bi bi-pin-fill h5 pin"
                    style={{ color: "white" }}
                    onClick={(e) => {
                      e.currentTarget.style.display = "block";
                      setFlashcards(
                        [...flashcards].map((x) => {
                          if (x.index === flashcard.index) {
                            x.pinned = false;
                          }
                          return x;
                        })
                      );
                    }}
                    ref={pinnedRef}
                  ></i>
                )}

                {!flashcard.pinned && (
                  <i
                    className="bi bi-pin h5 pin"
                    onClick={(e) => {
                      e.currentTarget.style.display = "block";
                      setFlashcards(
                        [...flashcards].map((x) => {
                          if (x.index === flashcard.index) {
                            x.pinned = true;
                          }
                          return x;
                        })
                      );
                    }}
                    ref={pinRef}
                    onMouseOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.parentNode.style.backgroundColor =
                        "#e9eaea";
                    }}
                    onMouseOut={(e) => {
                      e.preventDefault();
                      e.currentTarget.parentNode.style.backgroundColor =
                        "white";
                    }}
                    style={{ color: "white" }}
                  ></i>
                )}
              </button>
            </div>
            <div
              className="card-body py-0 my-0"
              ref={bodyRef}
              style={{
                WebkitUserModify: "read-only",
                WebkitLineBreak: "after-white-space",
              }}
            >
              <div
                className={true ? "input-group py-0 mb-0 mt-2" : "input-group"}
                style={{ display: "none" }}
              >
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
                <div
                  contentEditable="plaintext-only"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "auto",
                    wordBreak: "break-all",
                  }}
                  className={"shadow-none border-0 m-0 p-0 list-font"}
                  ref={inputRef}
                  spellCheck="true"
                  dir="ltr"
                ></div>
              </div>
              {flashcard.checklist && (
                <ul
                  type="none"
                  className="flashcard-options py-1 px-0 mx-0 my-1"
                  style={{ outline: "none" }}
                >
                  {flashcard.content.map((todos, index) => (
                    <li
                      className="list"
                      draggable
                      key={index}
                      type="none"
                      onDragStart={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <span
                        className="move"
                        key={uuidv4()}
                        style={{ display: "none" }}
                      >
                        <i
                          className="bi bi-three-dots-vertical move white h5"
                          style={{
                            marginLeft: "-2rem",
                            marginRight: "-2rem",
                          }}
                        ></i>
                        <i
                          className="bi bi-three-dots-vertical move white h5"
                          style={{
                            marginLeft: "1.1rem",
                            marginRight: "0rem",
                          }}
                        ></i>
                      </span>

                      <div
                        className="flashcard-option"
                        key={uuidv4()}
                        type="none"
                        style={{
                          float: "left",
                          marginRight: "1rem",
                          display: "inline-flex",
                          verticalAlign: "middle",
                        }}
                      >
                        <input
                          className="myform-input shadow-none"
                          type="checkbox"
                          defaultChecked={todos.completed}
                          style={{
                            border: "1px solid #7f7f7f",
                            cursor: "pointer",
                            color: "#bfbfbf",
                          }}
                          onChange={handleChange}
                        />
                      </div>

                      <div
                        className="flashcard-option"
                        key={uuidv4()}
                        type="none"
                        style={{
                          marginRight: "auto",
                          float: "left",
                          display: "inline-flex",
                          verticalAlign: "middle",
                        }}
                      >
                        {todos.completed ? (
                          <div
                            contentEditable="false"
                            suppressContentEditableWarning={true}
                            className="text-secondary input-box completed shadow-none border-0"
                            style={{
                              display: "inline-block",
                              float: "left",
                              whiteSpace: "normal",
                            }}
                            onInput={handleInputChange}
                          >
                            {todos.todo}
                          </div>
                        ) : (
                          <div
                            contentEditable="false"
                            suppressContentEditableWarning={true}
                            className="input-box shadow-none border-0"
                            style={{
                              display: "inline-block",
                              float: "left",
                              whiteSpace: "normal",
                            }}
                            onInput={handleInputChange}
                          >
                            {todos.todo}
                          </div>
                        )}
                      </div>

                      <div
                        key={uuidv4()}
                        type="none"
                        className="cross"
                        style={{
                          float: "right",
                          marginLeft: "1rem",
                          display: "inline-flex",
                          verticalAlign: "middle",
                          justifyContent: "center",
                          borderRadius: "50%",
                        }}
                        onClick={deleteTask}
                      >
                        <i
                          className="bi bi-x hover-dark h4"
                          style={{
                            display: "none",
                            cursor: "pointer",
                            float: "right",
                          }}
                          disabled
                        ></i>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {!flashcard.checklist && (
                <div
                  contentEditable="false"
                  suppressContentEditableWarning={true}
                  className=" input-box shadow-none border-0"
                  style={{
                    width: "auto",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: "16",
                    WebkitBoxOrient: "vertical",
                    letterSpacing: "0.2px",
                    padding: "0px 16px",
                    maxHeight: "32rem",
                  }}
                  empty-note={placeholder}
                  onInput={handleContentChange}
                  aria-multiline="true"
                  multiline="true"
                  role="textbox"
                  spellCheck="true"
                  dir="ltr"
                >
                  {flashcard.content}
                </div>
              )}
            </div>

            <div
              className="card-footer border-0 p-0"
              ref={footerRef}
              style={{ backgroundColor: "white" }}
            >
              <button
                className="btn border-0 p-0 rounded-circle threedots-holder threedots"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i
                  className="bi bi-three-dots-vertical threedots"
                  onClick={(e) => {
                    e.currentTarget.style.display = "block";
                  }}
                  ref={threedotRef}
                  onMouseOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.parentNode.style.backgroundColor =
                      "#e9eaea";
                  }}
                  onMouseOut={(e) => {
                    e.preventDefault();
                    e.currentTarget.parentNode.style.backgroundColor = "white";
                  }}
                  style={{ color: "white" }}
                ></i>
              </button>
              <div className="dropdown">
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <button
                    className="dropdown-item threedots"
                    onClick={deleteNote}
                  >
                    Delete note
                  </button>
                  <button
                    className="dropdown-item threedots"
                    onClick={makeCopy}
                  >
                    {" "}
                    Make a copy
                  </button>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
