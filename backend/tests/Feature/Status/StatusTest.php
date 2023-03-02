<?php

namespace Tests\Feature\Status;

use App\Models\Status;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class StatusTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_user_can_see_status()
    {
        $status = Status::factory()->count(10)->create();

        $response = $this->actingAs($this->user)->get('api/status');
        $response->assertStatus(200);
        // ->assertJson("total", 40);
    }

    public function test_user_can_see_they_status()
    {
        $user = User::factory()->create();
        $status = Status::factory()->count(10)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($this->user)->get("api/status/posted/$user->id");
        $response->assertStatus(200);
    }

    public function test_user_can_add_status()
    {
        $status = Status::factory()->create();

        $response = $this->actingAs($this->user)->postJson('api/status', $status->toArray());

        // dd($status);

        $response->assertStatus(201)
            ->assertJsonPath('data.sentences', $status->sentences);
    }

    public function test_user_can_see_one_status()
    {
        $status = Status::factory()->create();

        $response = $this->actingAs($this->user)->get("api/status/$status->id");
        // dd($response);
        $response->assertStatus(200);
    }

    public function test_user_can_update_status()
    {
        $statuses = Status::factory()->create();
        // dd($statuses);
        $statuses->sentences = "New Sentences";
        $response = $this->actingAs($this->user)->postJson("/api/status/$statuses->id/edit", $statuses->toArray());

        $response->assertStatus(201)
            ->assertJson(['sentences' => $statuses->sentences]);

        $this->assertDatabaseHas($statuses->getTable(), [
            'sentences' => $statuses->sentences,
        ]);
    }

    public function test_user_can_toggle_love_status(){
        $status = Status::factory()->create();

        $response = $this->actingAs($this->user)->postJson("api/status/$status->id/love");
        $response->assertStatus(200)->assertJson(['love_status' => true]);
        $response = $this->actingAs($this->user)->postJson("api/status/$status->id/love");
        $response->assertStatus(200)->assertJson(['love_status' => false]);
    }

    public function test_user_can_delete_status(){
        $status = Status::factory()->create();
        $response = $this->actingAs($this->user)->deleteJson("api/status/$status->id");

        $response->assertStatus(204);

        $this->assertDatabaseMissing($status->getTable(), [
            'id' => $status->id
        ]);
    }
}
