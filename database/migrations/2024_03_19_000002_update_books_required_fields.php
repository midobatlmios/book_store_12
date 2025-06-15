<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, modify the type column to be nullable
        DB::statement("ALTER TABLE books MODIFY COLUMN type ENUM('Fiction', 'Non-Fiction') DEFAULT 'Fiction'");
        
        Schema::table('books', function (Blueprint $table) {
            $table->string('isbn')->nullable()->default('0000000000000')->change();
            $table->string('publisher')->nullable()->default('Unknown')->change();
            $table->text('description')->nullable()->change();
            $table->unsignedInteger('stocks')->default(0)->change();
            $table->unsignedInteger('pages')->default(0)->change();
            $table->unsignedInteger('weight')->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE books MODIFY COLUMN type ENUM('Fiction', 'Non-Fiction')");
        
        Schema::table('books', function (Blueprint $table) {
            $table->string('isbn')->change();
            $table->string('publisher')->change();
            $table->text('description')->change();
            $table->unsignedInteger('stocks')->change();
            $table->unsignedInteger('pages')->change();
            $table->unsignedInteger('weight')->change();
        });
    }
}; 