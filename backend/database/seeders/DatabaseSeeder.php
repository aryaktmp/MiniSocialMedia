<?php

namespace Database\Seeders;

use App\Models\Comments;
use App\Models\DismissStatus;
use App\Models\Status;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Comments::factory(10)->create();
        Status::factory(10)->create();
        User::create([
            'name' => 'aryakkk',
            'email' => 'arya@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('admin123'), // password
            'remember_token' => Str::random(10),
        ]);
    }
}
