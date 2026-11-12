<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    private function map(User $u): array
    {
        return [
            'id' => (string) $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'phone' => $u->phone,
            'role' => $u->role,
            'status' => $u->status,
            'registeredAt' => $u->registered_at,
            'totalBookings' => $u->total_bookings,
            'totalSpent' => $u->total_spent,
            'assignedPool' => $u->assigned_pool,
            'lastLogin' => $u->last_login,
        ];
    }

    public function index()
    {
        return response()->json(User::all()->map(fn ($u) => $this->map($u)));
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $u = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'] ?? 'password'),
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'] ?? 'Pelanggan',
            'status' => $data['status'] ?? 'Aktif',
            'registered_at' => $data['registeredAt'] ?? now()->format('Y-m-d'),
            'total_bookings' => $data['totalBookings'] ?? 0,
            'total_spent' => $data['totalSpent'] ?? 0,
            'assigned_pool' => $data['assignedPool'] ?? null,
            'last_login' => $data['lastLogin'] ?? null,
        ]);
        return response()->json($this->map($u), 201);
    }

    public function show(User $user)
    {
        return response()->json($this->map($user));
    }

    public function update(Request $request, User $user)
    {
        $data = $request->all();
        $user->update([
            'name' => $data['name'] ?? $user->name,
            'email' => $data['email'] ?? $user->email,
            'phone' => array_key_exists('phone', $data) ? $data['phone'] : $user->phone,
            'role' => $data['role'] ?? $user->role,
            'status' => $data['status'] ?? $user->status,
            'registered_at' => $data['registeredAt'] ?? $user->registered_at,
            'total_bookings' => $data['totalBookings'] ?? $user->total_bookings,
            'total_spent' => $data['totalSpent'] ?? $user->total_spent,
            'assigned_pool' => array_key_exists('assignedPool', $data) ? $data['assignedPool'] : $user->assigned_pool,
            'last_login' => array_key_exists('lastLogin', $data) ? $data['lastLogin'] : $user->last_login,
        ]);
        if (isset($data['password'])) {
            $user->update(['password' => Hash::make($data['password'])]);
        }
        return response()->json($this->map($user->fresh()));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['success' => true]);
    }
}
