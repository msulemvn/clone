import React from 'react';
import Flashcard from './Flashcard';

export default function FlashcardList({ flashcards, toggle }) {

    return (
        <div className='card-grid mb-5'>
            {
                flashcards.map((flashcard, index) => {
                    return <Flashcard flashcard={flashcard} key={index} toggle={toggle} />;
                })
            }
        </div>
    );
}
