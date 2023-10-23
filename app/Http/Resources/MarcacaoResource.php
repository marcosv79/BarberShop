<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarcacaoResource extends JsonResource
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
            'servico' => $this->servico,
            'data' => $this->data,
            'idBarbeiro' => $this->idBarbeiro,
            'idCliente' => $this->idCliente,
            'estado' => $this->estado,
            'custo' => $this->custo,
        ];
    }
}
