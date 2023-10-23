<?php

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginTest extends BaseTestCase
{

    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';
        $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        return $app;
    }

    public function test_login()
    {
        // Credenciais de login
        $credentials = [
            'email' => 'cliente1@gmail.com',
            'password' => 'projetopds_'
        ];
    
        // Tenta fazer o login com as credenciais fornecidas
        if (!Auth::attempt($credentials)) {
            // Caso as credenciais sejam inválidas, retorne uma resposta adequada
            return response([
                'message' => 'Email ou palavra-passe incorretos'
            ], 422);
        }
    
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
        
    }
/*
public function test_logout()
{
    // Autentica o utilizador
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;
    $user->currentAccessToken()->delete(); // Exclui o token de acesso atual (opcional)
    $this->actingAs($user);

    // Executa a solicitação de logout
    $response = $this->postJson('/logout');

    // Verifica se o logout foi bem-sucedido
    $response->assertNoContent();

    // Verifica se o token de acesso foi excluído do utilizador
    $this->assertEmpty($user->currentAccessToken());
}
*/
}