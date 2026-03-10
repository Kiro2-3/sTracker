<?php

use App\Models\User;

// Make sure the login page loads without errors
test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
    $response->assertSee('Sign in to your finance workspace');
    $response->assertSee('sTracker dashboard preview');
    $response->assertSee('Secure login');
});

// Verify that a user can log in with correct credentials
test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

// Logging in with the wrong password should fail and keep the user a guest
test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

// Ensure logout works
test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});

// New: make sure registration creates a user and logs them in
test('users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    // after registration we expect the user to be authenticated
    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    // and the database should contain the new record
    $this->assertDatabaseHas('users', ['email' => 'jane@example.com']);
});
