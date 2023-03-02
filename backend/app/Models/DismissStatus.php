<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DismissStatus extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $table = 'dismiss_status';
}
