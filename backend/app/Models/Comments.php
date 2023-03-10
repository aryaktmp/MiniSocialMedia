<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Comments extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $table = 'comments';

    public function scopeWithCountData($query)
    {
        return $query->selectRaw(
            'COALESCE(total_love, 0) as total_love,
            COALESCE(total_reply, 0) as total_reply'
        )
            ->leftJoin(DB::raw('(select count(id) as total_love, comment_status_id from love_statuses group by comment_status_id)love'), 'love.comment_status_id', '=', 'comments.id')
            ->leftJoin(DB::raw('(select count(id) as total_reply, comment_status_id from comments group by comment_status_id) comment'), 'comment.comment_status_id', '=', 'comments.id');
    }
    public function scopeWithCountLove($query)
    {
        return $query->selectRaw(
            'COALESCE(total_love, 0) as total_love'
        )
            ->leftJoin(DB::raw('(select count(id) as total_love, comment_status_id from love_statuses group by comment_status_id)love'), 'love.comment_status_id', '=', 'comments.id');
    }
    public function subComments()
    {
        return $this->hasMany(Comments::class, 'comment_status_id', 'id')
            ->selectRaw('id,status_id,comments.comment_status_id,comment,created_at,user_id')
            ->WithCountLove()
            ->WithLoveStatus()
            ->with('User')
            ->orderBy('created_at', 'ASC');
    }

    public function scopeWithLoveStatus($query)
    {
        return $query->selectRaw("
            CASE
                WHEN love_statuses.love_status THEN 1
            ELSE 0
            END as love_status
        ")->leftJoin(DB::raw("(select comment_status_id, TRUE love_status from love_statuses WHERE user_id='" . auth()->id() . "') love_statuses"), 'comments.id', '=', 'love_statuses.comment_status_id');
    }

    public function User()
    {
        return $this->belongsTo(User::class);
    }
}
