<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\File;

class PortfolioController extends Controller
{
    public function index(): View
    {
        $projects = collect(json_decode(
            File::get(base_path('data/projects.json')),
            true
        ));

        return view('pages.home', compact('projects'));
    }
}
