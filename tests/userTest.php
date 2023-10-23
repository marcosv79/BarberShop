<?php

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

use App\Models\User;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserTest extends BaseTestCase
{
    /**
     * Creates the application.
     *  
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';
        $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        return $app;
    }
/*
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
/*    public function index()
    {
        return UserResource::collection(User::query()->orderBy('id', 'desc')->paginate(10));
    }
*/
/*
    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return \Illuminate\Http\Response
     */
 /*   public function test_create_user()
    {
        $userData = [
            'name' => 'TesteUser',
            'email' => 'testeuser@gmail.com',
            'password' => bcrypt('123456'),
            'tipo' => 'cliente' 
        ];
    
        // Cria um novo usuário na base de dados
        $user = User::create($userData);
    
        // Verifica se o usuário existe na base de dados
        $this->assertDatabaseHas('users', [
            'name' => 'TesteUser',
            'email' => 'testeuser@gmail.com'
        ]);
    }

/*
    /**
     * Display the specified resource.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
 /*   public function show(User $user)
    {
        return new UserResource($user);
    }
*/
/*
    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateUserRequest $request
     * @param \App\Models\User                     $user
     * @return \Illuminate\Http\Response
     */
 /*   public function test_edit_user()
    {
        // Define os novos dados do usuário
        $newUserData = [
            'name' => 'NovoNome',
            'email' => 'novoemail@gmail.com',
            'password' => bcrypt('654321'),
            'tipo' => 'cliente'
        ];
    
        // Encontra o usuário que você deseja editar
        $user = User::where('email', 'testeuser@gmail.com')->first();
    
        if ($user) {
            $user->update($newUserData);
    
            // Verifica se os dados do usuário foram atualizados corretamente
            $this->assertDatabaseHas('users', [
                'name' => 'NovoNome',
                'email' => 'novoemail@gmail.com'
            ]);
    
            return new UserResource($user);
        } else {
            return response('Utilizador não encontrado.', 404);
        }
    }
    */


    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function test_delete_user()
    {
        // Encontra o usuário que você deseja deletar
        $user = User::where('email', 'novoemail@gmail.com')->first();
    
        if ($user) {
            $user->delete();
    
            // Verifica se o utilizador foi apagado corretamente
            $this->assertDatabaseMissing('users', [
                'email' => 'novoemail@gmail.com'
            ]);
    
            return response("", 204);
        } else {
            return response('Utilizador não encontrado.', 404);
        }
}
}