<?php

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

use App\Models\Carrinho;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarcacaoRequest;
use App\Http\Requests\UpdateMarcacaoRequest;
use App\Http\Resources\MarcacaoResource;

class ComprasTest extends BaseTestCase
{

    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';
        $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        return $app;
    }

/*
    public function test_create_carrinho()
{
    // Dados do carrinho
    $carrinhoData = [
        'idProduto' => 1,
        'idCliente' => 1,
        'quantidadePedida' => 3,
        'preco' => 1,
        'nif' => 1234,
        'morada' => 'aaaa',
        'estado' => 'Pago',
    ];

    // Cria o carrinho na base de dados
    $carrinho = Carrinho::create($carrinhoData);

    // Verifica se o carrinho foi criado corretamente
    $this->assertDatabaseHas('carrinhos', $carrinhoData);
}
*/
/*
public function test_update_carrinho()
{
    // Dados atualizados do carrinho
    $updatedCarrinhoData = [
        'idProduto' => 1,
        'idCliente' => 1,
        'quantidadePedida' => 5,
        'preco' => 2,
        'nif' => 5678,
        'morada' => 'bbbb',
        'estado' => 'Em andamento',
    ];

    // Encontre o carrinho que você deseja editar
    $carrinho = Carrinho::find(96);

    // Verifique se o carrinho existe
    $this->assertNotNull($carrinho);

    // Atualize o carrinho com os novos dados
    $carrinho->update($updatedCarrinhoData);

    // Verifique se o carrinho foi atualizado corretamente
    $this->assertDatabaseHas('carrinhos', $updatedCarrinhoData);
}
*/
/*
public function test_delete_carrinho()
{
    // Encontre o carrinho que você deseja apagar
    $carrinho = Carrinho::find(96);

    // Verifique se o carrinho existe
    $this->assertNotNull($carrinho);

    // Apague o carrinho da base de dados
    $carrinho->delete();

    // Verifique se o carrinho foi removido corretamente
    $this->assertDatabaseMissing('carrinhos', ['id' => 96]);
}

*/
}