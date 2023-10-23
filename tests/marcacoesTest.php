<?php

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

use App\Models\Marcacao;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarcacaoRequest;
use App\Http\Requests\UpdateMarcacaoRequest;
use App\Http\Resources\MarcacaoResource;

class MarcacoesTest extends BaseTestCase
{

    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';
        $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        return $app;
    }
   
 /**
     * Display a listing of the resource.
     */
 /*   public function index()
    {
        return MarcacaoResource::collection(Marcacao::query()->orderBy('id', 'desc')->paginate(10));
    }
*/
    /**
     * Store a newly created resource in storage.
     */
 /*   public function test_create_marcacao()
    {
        // Dados da marcação
        $marcacaoData = [
            'data' => '2026-05-20',
            'servico' => 'barba',
            'idCliente' => 31,
            'idBarbeiro' => 28,
            // Adicione aqui outros campos necessários para a criação da marcação
        ];
    
        // Cria a marcação na base de dados
        $marcacao = Marcacao::create($marcacaoData);
    
        // Verifica se a marcação foi criada corretamente
        $this->assertDatabaseHas('marcacaos', $marcacaoData);
    }
*/
    /**
     * Display the specified resource.
     */
 /*   public function show(Marcacao $marcacao)
    {
        return new MarcacaoResource($marcacao);
    }

    /**
     * Update the specified resource in storage.
     */
 /*   public function test_edit_marcacao()
{
    // Dados atualizados da marcação
    $updatedMarcacaoData = [
        'id' => 44,
        'data' => '2025-05-21',
        'servico' => 'Barba',
        'idCliente' => 31,
        'idBarbeiro' => 28,
    ];

    // Obtém a instância da marcação que deseja editar
    $marcacao = Marcacao::find($updatedMarcacaoData['id']);

    if ($marcacao) {
        // Atualiza a marcação com os novos dados
        $marcacao->update($updatedMarcacaoData);

        // Verifica se a marcação foi atualizada corretamente
        $this->assertDatabaseHas('marcacaos', $updatedMarcacaoData);
    } else {
        // Caso a marcação não seja encontrada
        $this->fail('Marcação não encontrada.');
    }
}
*/

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Marcacao $marcacao
     * @return \Illuminate\Http\Response
     */
    public function test_delete_marcacao()
    {
        // ID da marcação que você deseja apagar
        $id = 43;
    
        // Encontre a marcação que você deseja apagar
        $marcacao = Marcacao::find($id);
    
        // Verifique se a marcação existe
        if ($marcacao) {
            // Apague a marcação da base de dados
            $marcacao->delete();
    
            // Verifique se a marcação foi removida corretamente
            $this->assertDatabaseMissing('marcacaos', ['id' => $id]);
        } else {
            // Caso a marcação não exista, retorne uma resposta adequada
            return response('Marcação não encontrada.', 404);
        }
    }
}