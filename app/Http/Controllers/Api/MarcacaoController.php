<?php

namespace App\Http\Controllers\Api;

use App\Models\Marcacao;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarcacaoRequest;
use App\Http\Requests\UpdateMarcacaoRequest;
use App\Http\Resources\MarcacaoResource;

class MarcacaoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return MarcacaoResource::collection(Marcacao::query()->orderBy('id', 'desc')->paginate(100));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMarcacaoRequest $request)
    {
        $data = $request->all();
        $marcacao = Marcacao::create($data);



        return response (new MarcacaoResource($marcacao), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Marcacao $marcacao)
    {
        return new MarcacaoResource($marcacao);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMarcacaoRequest $request, Marcacao $marcacao)
    {
        $data = $request->validated();
        $marcacao->update($data);
        return new MarcacaoResource($marcacao);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Marcacao $marcacao
     * @return \Illuminate\Http\Response
     */
    public function destroy(Marcacao $marcacao)
    {
        $marcacao->delete();

        return response("", 204);
    }
}
