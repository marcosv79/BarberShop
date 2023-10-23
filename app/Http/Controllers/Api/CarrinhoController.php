<?php

namespace App\Http\Controllers\Api;

use App\Models\Carrinho;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCarrinhoRequest;
use App\Http\Requests\UpdateCarrinhoRequest;
use App\Http\Resources\CarrinhoResource;

class CarrinhoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CarrinhoResource::collection(Carrinho::query()->orderBy('id', 'desc')->paginate(100));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCarrinhoRequest $request)
    {
        $data = $request->all();
        $carrinho = Carrinho::create($data);

        return response (new CarrinhoResource($carrinho), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Carrinho $carrinho)
    {
        return new CarrinhoResource($carrinho);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCarrinhoRequest $request, Carrinho $carrinho)
    {
        $data = $request->validated();
        $carrinho->update($data);

        return new CarrinhoResource($carrinho);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Carrinho $carrinho)
    {
        $carrinho->delete();

        return response("", 204);
    }
}
