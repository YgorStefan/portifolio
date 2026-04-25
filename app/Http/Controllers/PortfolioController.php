<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class PortfolioController extends Controller
{
    public function index(): View
    {
        try {
            $projects = collect(json_decode(
                File::get(base_path('data/projects.json')),
                true
            ) ?? []);
        } catch (\Throwable $e) {
            Log::error('Failed to load projects.json: ' . $e->getMessage());
            $projects = collect([]);
        }

        try {
            $skills = json_decode(
                File::get(base_path('data/skills.json')),
                true
            ) ?? [];
        } catch (\Throwable $e) {
            Log::error('Failed to load skills.json: ' . $e->getMessage());
            $skills = [];
        }

        return view('pages.home', compact('projects', 'skills'));
    }
}
