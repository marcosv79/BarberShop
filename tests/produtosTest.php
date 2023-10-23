<?php

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

use App\Models\Produto;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarcacaoRequest;
use App\Http\Requests\UpdateMarcacaoRequest;
use App\Http\Resources\MarcacaoResource;

class ProdutosTest extends BaseTestCase
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
        return ProdutoResource::collection(
            Produto::query()->orderBy('id','desc')->paginate(10)
        );
    }
*/
    /**
     * Store a newly created resource in storage.
     */
/*    public function test_create_produto()
    {
        // Dados do produto
        $produtoData = [
            'nome' => 'Produto Teste',
            'descricao' => 'aaaa',
            'preco' => 9.99,
            'quantidade' => 5,
            'tipo' => 'Barba',
        ];

    // Cria o produto na base de dados
    $produto = Produto::create($produtoData);

    // Verifica se o produto foi criado corretamente
    $this->assertDatabaseHas('produtos', $produtoData);
    }
*/
    /**
     * Display the specified resource.
     */
 /*  public function show(Produto $produto)
    {
        return new ProdutoResource($produto);
    }

    /**
     * Update the specified resource in storage.
     */
 /*   public function test_edit_produto()
    {
        // Dados atualizados do produto
        $updatedProdutoData = [
            'nome' => 'Novo Nome',
            'descricao' => 'Nova descrição',
            'preco' => 19.99,
            'quantidade' => 6,
            'tipo' => 'Barba',
        ];
    
        // Encontra o produto que você deseja editar
        $produto = Produto::where('id', 4)->first();
    
        // Verifica se o produto existe
        if ($produto) {
            // Atualiza o produto com os novos dados
            $produto->update($updatedProdutoData);
    
            // Verifica se o produto foi atualizado corretamente
            $this->assertDatabaseHas('produtos', $updatedProdutoData);
        } else {
            // Caso o produto não exista, retorne uma resposta adequada
            return response('Produto não encontrado.', 404);
        }
    }
*/
    /**
     * Remove the specified resource from storage.
     */
    public function test_delete_produto()
    {
        // Encontre o produto que você deseja apagar
        $produto = Produto::find(4);
    
        // Verifique se o produto existe
        if ($produto) {
            // Apague o produto da base de dados
            $produto->delete();
    
            // Verifique se o produto foi removido corretamente
            $this->assertDatabaseMissing('produtos', ['id' => 4]);
        } else {
            // Caso o produto não exista, retorne uma resposta adequada
            return response('Produto não encontrado.', 404);
        }
    }


}    