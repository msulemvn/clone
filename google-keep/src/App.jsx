import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import React, { useState, useRef } from "react";
import CardList from "./components/CardList";
import Edit from "./components/Edit";
import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

function App() {
  if (!("NOTES" in localStorage)) {
    localStorage.setItem("NOTES", JSON.stringify([]));
  }

  if (!("REMINDERS" in localStorage)) {
    localStorage.setItem("REMINDERS", JSON.stringify([]));
  }

  if (!("LABELS" in localStorage)) {
    localStorage.setItem("LABELS", JSON.stringify([]));
  }

  if (!("ARCHIVE" in localStorage)) {
    localStorage.setItem("ARCHIVE", JSON.stringify([]));
  }

  if (!("BIN" in localStorage)) {
    localStorage.setItem("BIN", true);
  }

  const mainRef = useRef();
  const sidebarRef = useRef();
  const [flashcards, setFlashcards] = useState(
    JSON.parse(localStorage.getItem("NOTES"))
  );
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [toggle, setToggle] = useState(
    JSON.parse(localStorage.getItem("toggle"))
  );
  const [sidebarToggle, setSidebarToggle] = useState(
    JSON.parse(localStorage.getItem("sidebarToggle"))
  );
  const [sidebar, setSidebar] = useState(false);

  const toggleSidebar = (e) => {
    localStorage.setItem("sidebarToggle", !sidebarToggle);
    setSidebarToggle(!sidebarToggle);
    if (sidebarToggle) {
      sidebarRef.current.classList.add("sidebarToggle");
    } else {
      sidebarRef.current.classList.remove("sidebarToggle");
    }
  };

  const toggleGrid = (e) => {
    localStorage.setItem("toggle", !toggle);
    setToggle(!toggle);
  };
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <nav
        className="navbar navbar-light fixed-top bg-light border-bottom hoverSidebar"
        style={{
          height: "3rem",
          justifyContent: "space-between",
          padding: "8px",
        }}
      >
        <div
          className="d-flex"
          style={{ flexWrap: "nowrap", alignItems: "center", height: "3rem" }}
        >
          <span className="navbar-brand" style={{ marginRight: "0" }}>
            <button
              className={"btn border-0 rounded-circle hamburger-class"}
              role="button"
              style={
                sidebarToggle
                  ? { backgroundColor: "#e9eaea" }
                  : { backgroundColor: "#f8f9fa" }
              }
              onMouseOver={(e) => {
                if (!sidebarToggle) {
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                }
              }}
              onMouseOut={(e) => {
                if (!sidebarToggle) {
                  e.currentTarget.style.backgroundColor = "";
                }
              }}
              onClick={toggleSidebar}
            >
              <svg
                focusable="false"
                style={{ width: "24px", height: "24px", color: "#5f6368" }}
                viewBox="0 0 24 24"
              >
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
              </svg>
            </button>
          </span>
          <div
            className="navbar-brand wraptocenter d-none d-sm-block"
            style={{ marginRight: "0.5rem" }}
          >
            <span style={{ display: "inline-block" }}>
              <img
                src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"
                alt=""
                width="auto"
                height="40"
                style={{ display: "block" }}
              />
            </span>
          </div>
          <span
            className="d-none d-sm-block"
            style={{ lineHeight: "22px", fontSize: "22px", color: "#5f636" }}
          >
            Keep
          </span>
        </div>
        <form
          className="d-flex border-0 col-xxl-6 col-xl-6 col-lg-6"
          style={{
            backgroundColor: "#f1f3f4",
            borderRadius: "8px",
            height: "3rem",
          }}
          role="search"
        >
          <div
            className="navbar-brand wraptocenter circle"
            style={{ marginRight: "0", padding: "3px 6px" }}
          >
            <span
              onMouseOver={(e) => {
                e.currentTarget.children[0].style.backgroundColor = "#e9eaea";
              }}
              onMouseOut={(e) => {
                e.currentTarget.children[0].style.backgroundColor = "#f1f3f4";
              }}
            >
              <button
                className="btn input-group-text border-0 rounded-circle "
                type="button"
                aria-expanded="false"
                style={{ padding: "0.5rem", height: "auto", width: "1.6rem" }}
              >
                <i className="bi bi-search h5"></i>
              </button>
            </span>
          </div>
          <input
            className="form-control shadow-none border-0 d-none d-md-block"
            type="search"
            placeholder="Search"
            aria-label="Search"
            style={{ backgroundColor: "#f1f3f4" }}
          />
        </form>
        <div className="icons d-none d-sm-block">
          <span
            className="navbar-brand"
            style={{ marginRight: "0" }}
            onMouseOver={(e) => {
              e.currentTarget.children[0].style.backgroundColor = "#e9eaea";
            }}
            onMouseOut={(e) => {
              e.currentTarget.children[0].style.backgroundColor = "#f8f9fa";
            }}
          >
            <button
              className="btn input-group-text border-0 rounded-circle"
              type="button"
              aria-expanded="false"
              style={{
                backgroundColor: "#f8f9fa",
                height: "2rem",
                width: "2rem",
                padding: "6px",
              }}
            >
              <i className="bi bi-arrow-clockwise h5"></i>
            </button>
          </span>

          <span
            className="navbar-brand"
            style={{ marginRight: "0" }}
            onMouseOver={(e) => {
              e.currentTarget.children[0].style.backgroundColor = "#e9eaea";
            }}
            onMouseOut={(e) => {
              e.currentTarget.children[0].style.backgroundColor = "#f8f9fa";
            }}
          >
            <button
              className="btn input-group-text border-0 rounded-circle"
              onClick={toggleGrid}
              type="button"
              aria-expanded="false"
              style={{
                backgroundColor: "#f8f9fa",
                height: "2rem",
                width: "2rem",
                padding: "6px",
              }}
            >
              {toggle ? (
                <i className="bi bi-view-stacked h5"></i>
              ) : (
                <i className="bi bi-grid h5"></i>
              )}
            </button>
          </span>
          <span
            className="navbar-brand"
            style={{ marginRight: "0" }}
            onMouseOver={(e) => {
              e.currentTarget.children[0].style.backgroundColor = "#e9eaea";
            }}
            onMouseOut={(e) => {
              e.currentTarget.children[0].style.backgroundColor = "#f8f9fa";
            }}
          >
            <button
              className="btn input-group-text border-0 rounded-circle"
              type="button"
              aria-expanded="false"
              style={{
                backgroundColor: "#f8f9fa",
                height: "2rem",
                width: "2rem",
                padding: "6px",
              }}
            >
              <i className="bi bi-gear h5"></i>
            </button>
          </span>
        </div>
      </nav>
      <nav className="collapse d-lg-block bg-white">
        <div
          className={"sidebar".concat(sidebarToggle ? " sidebarToggle" : "")}
          ref={sidebarRef}
          onMouseOver={(e) => {
            if (!sidebarToggle) {
              setSidebar(true);
              e.currentTarget.classList.add("hoverSidebar");
            }
          }}
          onMouseOut={(e) => {
            if (!sidebarToggle) {
              setSidebar(false);
              e.currentTarget.classList.remove("hoverSidebar");
            }
          }}
        >
          <ul type="none" className="sidebar-ul">
            <li className={"active"}>
              <span className="icon">
                <button
                  className="btn border-0 rounded-circle shadow-none"
                  role="button"
                >
                  <i className="bi bi-lightbulb h5 sidebar-icons"></i>
                </button>
              </span>
              <span className={"title"}>Notes</span>
            </li>
            <li>
              <span className="icon">
                <button
                  className="btn border-0 rounded-circle shadow-none"
                  role="button"
                >
                  <i className="bi bi-bell h5 sidebar-icons"></i>
                </button>
              </span>
              <span className={sidebarToggle ? "title title-clicked" : "title"}>
                Reminders
              </span>
            </li>
            <li>
              <span className="icon">
                <button
                  className="btn border-0 rounded-circle shadow-none"
                  role="button"
                >
                  <i className="bi bi-pen h5 sidebar-icons"></i>
                </button>
              </span>
              <span className={sidebarToggle ? "title title-clicked" : "title"}>
                Edit Labels
              </span>
            </li>
            <li>
              <span className="icon">
                <button
                  className="btn border-0 rounded-circle shadow-none"
                  role="button"
                >
                  <i className="bi bi-archive h5 sidebar-icons"></i>
                </button>
              </span>
              <span className={sidebarToggle ? "title title-clicked" : "title"}>
                Archive
              </span>
            </li>
            <li>
              <span className="icon">
                <button
                  className="btn border-0 rounded-circle shadow-none"
                  role="button"
                >
                  <i className="bi bi-trash h5 sidebar-icons"></i>
                </button>
              </span>
              <span className={sidebarToggle ? "title title-clicked" : "title"}>
                Bin
              </span>
            </li>
          </ul>
        </div>
      </nav>

      <main ref={mainRef} className={sidebarToggle ? "sidebarMain" : ""}>
        <div className="column">
          <Edit
            todos={todos}
            setTodos={setTodos}
            title={title}
            setTitle={setTitle}
            setFlashcards={setFlashcards}
            flashcards={flashcards}
          />
        </div>
        <CardList
          flashcards={flashcards}
          setFlashcards={setFlashcards}
          toggle={toggle}
          setTodos={setTodos}
        ></CardList>
      </main>
    </DndProvider>
  );
}
export default App;
