<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CheckAdminStatus extends Command
{
    protected $signature = 'check:admin {email}';
    protected $description = 'Check if a user is admin';

    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email {$email} not found!");
            return 1;
        }

        $this->info("User {$email} exists!");
        $this->info("Admin status: " . ($user->is_admin ? "Yes" : "No"));
        
        if (!$user->is_admin) {
            $this->info("Making user admin...");
            $user->is_admin = true;
            $user->save();
            $this->info("User is now an admin!");
        }

        return 0;
    }
} 