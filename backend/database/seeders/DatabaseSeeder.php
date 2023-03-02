<?php

namespace Database\Seeders;

use App\Models\Comments;
use App\Models\DismissStatus;
use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        Comments::factory(10)->create();
        DismissStatus::factory(10)->create();
        Status::factory(10)->create();
    }
}
