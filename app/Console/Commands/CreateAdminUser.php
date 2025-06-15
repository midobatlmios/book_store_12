<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'create:admin';
    protected $description = 'Create an admin user';

    public function handle()
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@bookstore.com',
            'password' => Hash::make('admin123'),
            'is_admin' => true,
        ]);

        $this->info('Admin user created successfully!');
        $this->info('Email: admin@bookstore.com');
        $this->info('Password: admin123');
    }
} 