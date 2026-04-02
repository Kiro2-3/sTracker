<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardThemeTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_page_returns_ok_and_has_theme_script(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/dashboard');

        $response->assertOk();
        $response->assertSee("localStorage.getItem('theme')", false);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('summary')
            ->has('transactions')
        );
    }
}
