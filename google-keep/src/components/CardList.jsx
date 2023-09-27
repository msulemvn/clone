import React, { useState, useEffect } from "react";
import Flashcard from "./Flashcard";
import Masonry from "react-masonry-css";

export default function CardList({
  flashcards,
  setFlashcards,
  toggle,
  setTodos,
}) {
  const [anyPinned, setPinned] = useState();
  useEffect(() => {
    setPinned(false);
    flashcards.forEach((flashcard) => {
      if (flashcard.pinned) {
        setPinned(true);
        return;
      }
    });
  }, [flashcards]);

  return (
    <>
      {anyPinned && (
        <div
          className={"my-masonry-grid".concat(
            toggle
              ? " row col-xxl-5 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xsm-4 mx-auto"
              : ""
          )}
          style={{
            visibility: "visible",
            marginTop: "3rem",
            marginBottom: "-0.2rem",
            fontSize: ".6875rem",
            color: "#5f6368",
            textTransform: "uppercase",
            fontWeight: "550",
            lineHeight: "1rem",
          }}
        >
          &emsp;Pinned
        </div>
      )}

      <Masonry
        breakpointCols={
          toggle
            ? {
                default: 1,
              }
            : {
                default: 5,
                1100: 4,
                700: 3,
                500: 2,
              }
        }
        options={{
          transitionDuration: 0,
        }}
        columnClassName="p-0"
        className={"my-masonry-grid p-0".concat(
          toggle
            ? " row justify-content-center col-xxl-5 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xsm-4 mx-auto"
            : ""
        )}
        style={toggle ? { flexDirection: "column" } : {}}
      >
        {flashcards.map(
          (flashcard, id) =>
            flashcard.pinned && (
              <Flashcard
                key={id}
                flashcard={flashcard}
                flashcards={flashcards}
                setFlashcards={setFlashcards}
                toggle={toggle}
              />
            )
        )}
      </Masonry>

      {anyPinned && (
        <div
          className={"my-masonry-grid p-0".concat(
            toggle
              ? " row col-xxl-5 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xsm-4 mx-auto"
              : ""
          )}
          style={{
            visibility: "visible",
            marginTop: "3rem",
            marginBottom: "-0.2rem",
            fontSize: ".6875rem",
            color: "#5f6368",
            textTransform: "uppercase",
            fontWeight: "550",
            lineHeight: "1rem",
          }}
        >
          &emsp;Others
        </div>
      )}

      <Masonry
        breakpointCols={
          toggle
            ? {
                default: 1,
              }
            : {
                default: 5,
                1100: 4,
                700: 3,
                500: 2,
              }
        }
        columnClassName="p-0"
        options={{
          transitionDuration: 0,
        }}
        className={"my-masonry-grid p-0".concat(
          toggle
            ? " row justify-content-center col-xxl-5 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xsm-4 mx-auto"
            : ""
        )}
        style={toggle ? { flexDirection: "column" } : {}}
      >
        {flashcards.map(
          (flashcard, id) =>
            !flashcard.pinned && (
              <Flashcard
                key={id}
                flashcard={flashcard}
                flashcards={flashcards}
                setFlashcards={setFlashcards}
                toggle={toggle}
              />
            )
        )}
      </Masonry>
    </>
  );
}
