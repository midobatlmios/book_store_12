<?php

namespace App\Observers;

use App\Models\Book;

class BookObserver
{
    /**
     * Handle the Book "saving" event.
     */
    public function saving(Book $book): void
    {
        // Ensure stocks is not negative
        if ($book->stocks < 0) {
            $book->stocks = 0;
        }
    }
} 