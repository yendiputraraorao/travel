<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    private function map(Voucher $v): array
    {
        return [
            'id' => $v->id,
            'code' => $v->code,
            'title' => $v->title,
            'discountPercent' => $v->discount_percent,
            'maxDiscount' => $v->max_discount,
            'minTransaction' => $v->min_transaction,
            'validUntil' => $v->valid_until,
            'quota' => $v->quota,
            'usedCount' => $v->used_count,
            'description' => $v->description,
            'badgeText' => $v->badge_text,
        ];
    }

    public function index()
    {
        return response()->json(Voucher::all()->map(fn ($v) => $this->map($v)));
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $v = Voucher::create([
            'id' => $data['id'] ?? 'vouc-'.uniqid(),
            'code' => $data['code'],
            'title' => $data['title'],
            'discount_percent' => $data['discountPercent'],
            'max_discount' => $data['maxDiscount'],
            'min_transaction' => $data['minTransaction'],
            'valid_until' => $data['validUntil'],
            'quota' => $data['quota'],
            'used_count' => $data['usedCount'] ?? 0,
            'description' => $data['description'] ?? null,
            'badge_text' => $data['badgeText'] ?? null,
        ]);
        return response()->json($this->map($v), 201);
    }

    public function show(Voucher $voucher)
    {
        return response()->json($this->map($voucher));
    }

    public function update(Request $request, Voucher $voucher)
    {
        $data = $request->all();
        $voucher->update([
            'code' => $data['code'] ?? $voucher->code,
            'title' => $data['title'] ?? $voucher->title,
            'discount_percent' => $data['discountPercent'] ?? $voucher->discount_percent,
            'max_discount' => $data['maxDiscount'] ?? $voucher->max_discount,
            'min_transaction' => $data['minTransaction'] ?? $voucher->min_transaction,
            'valid_until' => $data['validUntil'] ?? $voucher->valid_until,
            'quota' => $data['quota'] ?? $voucher->quota,
            'used_count' => $data['usedCount'] ?? $voucher->used_count,
            'description' => array_key_exists('description', $data) ? $data['description'] : $voucher->description,
            'badge_text' => array_key_exists('badgeText', $data) ? $data['badgeText'] : $voucher->badge_text,
        ]);
        return response()->json($this->map($voucher->fresh()));
    }

    public function destroy(Voucher $voucher)
    {
        $voucher->delete();
        return response()->json(['success' => true]);
    }
}
