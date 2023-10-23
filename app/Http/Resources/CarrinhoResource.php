<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarrinhoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'idProduto' => $this->idProduto,
            'idCliente' => $this->idCliente,
            'quantidadePedida' => $this->quantidadePedida,
            'preco' => $this->preco,
            'nif' => $this->nif,
            'morada' => $this->morada,
            'estado' => $this->estado,
        ];
    }
}
