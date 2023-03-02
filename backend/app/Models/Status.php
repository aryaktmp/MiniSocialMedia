<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Status extends Model
{
    use HasFactory;

    protected $table = 'statuses';

    protected $guarded = [];

    public function scopeWithCountData($query)
    {
        return $query->selectRaw("
            COALESCE(total_comment, 0) as total_comment,
            COALESCE(total_love, 0) as total_love,
            COALESCE(total_view, 0) as total_view                      
        ")
            ->leftJoin(DB::raw('(select count(id) as total_comment, status_id from comments group by status_id) comment'), 'comment.status_id', '=', 'statuses.id')
            ->leftJoin(DB::raw('(select count(id) as total_love, status_id from love_statuses group by status_id) love'), 'love.status_id', '=', 'statuses.id')
            ->leftJoin(DB::raw('(select count(id) as total_view, status_id from detail_view_statuses group by status_id) view'), 'view.status_id', '=', 'statuses.id');
    }

    public function Comments()
    {
        return $this->hasMany(Comments::class, 'status_id', 'id')
            ->selectRaw('comments.id,status_id,comment,comments.created_at,user_id')
            ->where('comments.comment_status_id', 0)
            ->WithCountData()
            ->with('User')
            ->with('subComments')
            ->leftJoin('users', 'users.id', 'comments.user_id')
            ->orderBy('comments.created_at', 'ASC');
    }

    public function User()
    {
        return $this->belongsTo(User::class);
    }
}
