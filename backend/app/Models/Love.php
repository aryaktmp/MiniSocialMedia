<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Love extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $table = "love_statuses";

    public function scopeWithProfile($query){
        return $query->leftJoin("users", "love_statuses.user_id", '=', 'users.id')->orderBy('love_statuses.created_at', 'DESC');
    }
}
