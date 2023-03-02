<?php

namespace Tests\Feature\Status;

use App\Models\Comments;
use App\Models\Status;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic feature test example.
     *
     * @return void
     */

    public function test_user_can_create_comment()
    {
        $status = Status::factory()->create();

        $comment = Comments::factory()->make([
            'status_id' => $status->id
        ]);

        $comment->mode = 'status';

        $response = $this->actingAs($this->user)->postJson("api/comments/$status->id", $comment->toArray());

        $response->assertStatus(201)
            ->assertJson(['comment' => $comment->comment]);
        $this->assertDatabaseHas($comment->getTable(), [
            'comment' => $comment->comment
        ]);
    }

    public function test_user_can_create_sub_comments()
    {
        $status = Status::factory()->create();

        $comment = Comments::factory()->create([
            'status_id' => $status->id,
            'user_id' => User::factory()->create()->id
        ]);

        $sub_comment = Comments::factory()->make([
            'status_id' => $status->id,
        ]);

        $sub_comment->mode = 'comment';

        $response = $this->actingAs($this->user)->postJson("api/comments/$comment->id", $sub_comment->toArray());

        $response->assertStatus(201)
            ->assertJson(['comment' => $sub_comment->comment]);
        $this->assertDatabaseHas($sub_comment->getTable(), [
            'comment' => $sub_comment->comment
        ]);
    }

    public function test_user_can_toggle_love_comment()
    {
        $comment = Comments::factory()->create([
            'user_id' => User::factory()->create()->id,
        ]);

        $response = $this->actingAs($this->user)->postJson("api/comments/$comment->id/love");
        $response->assertStatus(200)->assertJson(['love_status' => true]);
        $response = $this->actingAs($this->user)->postJson("api/comments/$comment->id/love");
        $response->assertStatus(200)->assertJson(['love_status' => false]);
    }

    public function test_user_can_delete_comments(){
        $comment = Comments::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->deleteJson("api/comments/$comment->id");

        $response->assertStatus(204);

        $this->assertDatabaseMissing($comment->getTable(), [
            'id' => $comment->id
        ]);
    }
}
