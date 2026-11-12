<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pool;
use Illuminate\Http\Request;

class PoolController extends Controller
{
    private function map(Pool $p): array
    {
        return [
            'id' => $p->id,
            'city' => $p->city,
            'name' => $p->name,
            'address' => $p->address,
            'phone' => $p->phone,
        ];
    }

    public function index()
    {
        return response()->json(Pool::all()->map(fn ($p) => $this->map($p)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'city' => 'required|string',
            'name' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
        ]);
        if (empty($data['id'])) {
            $data['id'] = 'pool-'.uniqid();
        }
        $p = Pool::create($data);
        return response()->json($this->map($p), 201);
    }

    public function show(Pool $pool)
    {
        return response()->json($this->map($pool));
    }

    public function update(Request $request, Pool $pool)
    {
        $data = $request->validate([
            'city' => 'sometimes|string',
            'name' => 'sometimes|string',
            'address' => 'sometimes|string',
            'phone' => 'sometimes|string',
        ]);
        $pool->update($data);
        return response()->json($this->map($pool));
    }

    public function destroy(Pool $pool)
    {
        $pool->delete();
        return response()->json(['success' => true]);
    }
}
