<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    protected const USER_DEFAULT_ID = '1';
    protected $user;

    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::find(self::USER_DEFAULT_ID);
        $this->withoutMiddleware(ThrottleRequests::class);
    }
}
