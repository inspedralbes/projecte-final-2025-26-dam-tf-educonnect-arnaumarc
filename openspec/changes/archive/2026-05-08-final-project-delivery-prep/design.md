## Context

The project is a multi-module educational platform (Backend, Frontend, Mobile, Discord Bot). Academic delivery requires a formalized structure for Design (UML, mockups) and Source Code (deployment guides, installers). The current documentation is scattered and informal.

## Goals / Non-Goals

**Goals:**
- Provide clear, academic-standard UML diagrams (Mermaid format).
- Document the application flow and UX.
- Simplify the installation process for evaluators.
- Complete the user manual with visual evidence.

**Non-Goals:**
- Refactoring the core application logic (unless necessary for deployment stability).
- Implementing new application features beyond documentation/deployment.
- Creating compiled binary installers (npm-based automation is sufficient).

## Decisions

### 1. Diagramming Tool: Mermaid.js
- **Decision**: Use Mermaid.js within Markdown files for all UML diagrams.
- **Rationale**: Keeps diagrams version-controlled alongside code, easily editable, and rendered natively by GitHub and VSCode.
- **Alternatives**: Using static PNGs from external tools (harder to maintain).

### 2. Automation: Root-level Setup Script
- **Decision**: Create a `main/setup.js` script to handle recursive `npm install`.
- **Rationale**: Evaluators often struggle with multiple `package.json` files. A single entry point improves the experience.
- **Alternatives**: shell scripts (less cross-platform than Node.js).

### 3. Documentation Structure: Academic Alignment
- **Decision**: Organize the `doc/` folder into two main sub-sections: `C-Disseny` and `D-CodiFont`.
- **Rationale**: Direct alignment with the professor's delivery requirements simplifies the grading process.

## Risks / Trade-offs

- **[Risk]** Mermaid diagrams might not render correctly in all viewers → **Mitigation**: Provide exported PNG versions in `doc/img/`.
- **[Risk]** Setup script might fail on different OS (Windows vs Linux) → **Mitigation**: Use Node's `cross-spawn` or `child_process` with cross-platform considerations.
- **[Risk]** Screenshots might become outdated quickly → **Mitigation**: Focus on core features and keep the manual concise.
