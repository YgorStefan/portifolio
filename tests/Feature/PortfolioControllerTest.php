<?php

namespace Tests\Feature;

use Tests\TestCase;

class PortfolioControllerTest extends TestCase
{
    public function test_home_loads(): void
    {
        $this->get('/')->assertStatus(200);
    }

    public function test_skills_have_required_fields(): void
    {
        $skills = $this->getSkills();

        $this->assertNotEmpty($skills);
        foreach ($skills as $skill) {
            $this->assertArrayHasKey('name', $skill);
            $this->assertArrayHasKey('icon', $skill);
            $this->assertArrayHasKey('category', $skill);
            $this->assertContains(
                $skill['category'],
                ['backend', 'frontend', 'devops'],
                "Skill '{$skill['name']}' tem categoria inválida: '{$skill['category']}'"
            );
        }
    }

    public function test_vite_is_in_frontend(): void
    {
        $skills = $this->getSkills();
        $vite = collect($skills)->firstWhere('name', 'Vite');

        $this->assertNotNull($vite, 'Skill Vite não encontrada');
        $this->assertSame('frontend', $vite['category']);
    }

    public function test_no_skill_has_tools_category(): void
    {
        $skills = $this->getSkills();
        $toolsSkills = collect($skills)->where('category', 'tools')->values();

        $this->assertCount(0, $toolsSkills, 'Categoria "tools" foi removida mas ainda existem skills com ela');
    }

    public function test_iaml_has_svg_field(): void
    {
        $skills = $this->getSkills();
        $iaml = collect($skills)->firstWhere('name', 'IA/ML');

        $this->assertNotNull($iaml, 'Skill IA/ML não encontrada');
        $this->assertArrayHasKey('svg', $iaml);
        $this->assertStringStartsWith('<svg', $iaml['svg']);
    }

    public function test_response_has_csp_header(): void
    {
        $response = $this->get('/');
        $response->assertHeader('Content-Security-Policy');
        $csp = $response->headers->get('Content-Security-Policy');
        $this->assertStringContainsString("default-src 'self'", $csp);
        $this->assertStringContainsString('https://cdn.jsdelivr.net', $csp);
    }

    public function test_skills_fallback_to_empty_array_when_json_missing(): void
    {
        // Renomear temporariamente o arquivo para simular ausência
        $path = base_path('data/skills.json');
        $temp = $path . '.bak';
        rename($path, $temp);

        try {
            $response = $this->get('/');
            $response->assertStatus(200);
            $skills = $response->viewData('skills');
            $this->assertIsArray($skills);
            $this->assertEmpty($skills);
        } finally {
            rename($temp, $path);
        }
    }

    private function getSkills(): array
    {
        return $this->get('/')->viewData('skills');
    }
}
