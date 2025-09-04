import json
import os

# -----------------------------
# Default Project Metadata
# -----------------------------
PROJECTS = {
    "Jovibe Portfolio": {
        "theme": "Dark and light, Modern, Minimal",
        "primary_colors": ["#1e1e2f", "#ffffff"],  # Dark background, white text
        "accent_colors": ["#9b59b6", "#ff7f50"],  # Purple and Orange
        "stack": ["HTML", "CSS", "JavaScript", "TailwindCSS"],
        "style": "Glassmorphism cards, smooth animations, responsive layout",
        "design_pattern": "Component-based with reusable UI modules",
        "branding": {
            "logo": "jovibe_logo.png",
            "font": "Roboto, sans-serif",
            "icon_set": "Material Icons"
        },
        "mock_data": {
            "portfolio": "6-8 sample projects with title, image, description, tech stack",
            "blog": "3-5 sample posts with title, excerpt, date",
            "testimonials": "3 sample testimonials with name, message, role",
            "contact_form": "Mock form with name, email, message"
        },
        "special_effects": "smooth color transitions"
    }
}

# -----------------------------
# Load commits JSON
# -----------------------------
with open("commits_360.json", "r") as f:
    commits = json.load(f)

# -----------------------------
# Generate Prompt for AI Agent
# -----------------------------
def generate_prompt(commit, project_name, detailed=False):
    """
    Generate detailed or simplified prompt for a commit
    """
    project = PROJECTS[project_name]
    
    if detailed:
        project_info = f"""
Project Details:
- Theme: {project['theme']}
- Primary colors: {', '.join(project['primary_colors'])}
- Accent colors: {', '.join(project['accent_colors'])}
- Stack: {', '.join(project['stack'])}
- Style: {project['style']}
- Design Pattern: {project['design_pattern']}
- Branding: logo ({project['branding']['logo']}), font ({project['branding']['font']}), icon set ({project['branding']['icon_set']})
- Mock Data: {project['mock_data']}
- Special Effects: {project['special_effects']}
"""
    else:
        # Less detailed prompt for subsequent iterations
        project_info = f"Project '{project_name}', Dark and light theme with purple & orange accents, glassmorphism, smooth animations, modern layout and design."

    prompt = f"""
You are working on project '{project_name}'.
{project_info}

Commit Task Details:
- Commit Number: {commit['commit_number']}
- Timestamp: {commit['timestamp']}
- Task: {commit['task']}
- Instructions: {commit['instructions']}
- Commit Message: {commit['commit_message']}

Instructions for AI Agent:
1. Implement the task according to the project theme, style, stack, and mock data.
2. Ensure responsive design and smooth animations.
3. Use glassmorphism, and color accents as described.
4. Commit the changes with:
   git add . && git commit -m "{commit['commit_message']}" --date="{commit['timestamp']}"
5. Prepare for the next commit by running this script again to get the next task.

Output:
- Provide implementation steps for this commit only.
- Do not generate code unless explicitly instructed.
"""
    return prompt

# -----------------------------
# Incremental Commit Runner
# -----------------------------
def get_next_commit(index, project_name, first_run=False):
    """
    Returns the prompt for the commit at the given index
    """
    if index < len(commits):
        commit = commits[index]
        return generate_prompt(commit, project_name, detailed=first_run)
    else:
        return None

# -----------------------------
# Example Usage
# -----------------------------
if __name__ == "__main__":
    # Example: track the last run using a simple file
    last_run_file = "last_commit_index.txt"
    
    if os.path.exists(last_run_file):
        with open(last_run_file, "r") as f:
            current_index = int(f.read().strip()) # This is the index of the next commit to process
        first_run = False
    else:
        current_index = 0
        first_run = True
    
    # Get the next commit prompt
    prompt = get_next_commit(current_index, "Jovibe Portfolio", first_run)
    
    if prompt:
        print(prompt)
        # Save index of the next commit for next iteration
        with open(last_run_file, "w") as f:
            f.write(str(current_index + 1)) # Save the index of the next commit to be processed
    else:
        print("All commits completed!")
