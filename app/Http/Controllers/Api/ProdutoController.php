<?php

namespace App\Http\Controllers\Api;

use App\Models\Produto;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProdutoRequest;
use App\Http\Requests\UpdateProdutoRequest;
use App\Http\Resources\ProdutoResource;

class ProdutoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProdutoResource::collection(
            Produto::query()->orderBy('id','desc')->paginate(100)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProdutoRequest $request)
    {
        $data = $request->validated();
        $produto = Produto::create($data);
        return response (new ProdutoResource($produto), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Produto $produto)
    {
        return new ProdutoResource($produto);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProdutoRequest $request, Produto $produto)
    {
        $data = $request->validated();
        $produto->update($data);
        return new ProdutoResource($produto);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Produto $produto)
    {
        $produto->delete();
        return response("",204);
    }
}
