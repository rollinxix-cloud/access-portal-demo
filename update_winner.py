import sys
import os
import re
import subprocess

# Simple dictionary map to translate short command inputs into the exact key in app.js
TOURNAMENT_MAP = {
    "league": "elite_league",
    "division": "elite_division",
    "camp": "pes_camp",
    "ultimate": "ultimate_player"
}

def run_git_commands(commit_message):
    """Executes git commands to push changes directly to your cloud repository."""
    try:
        print("\n🚀 Deploying changes to GitHub...")
        subprocess.run(["git", "add", "app.js"], check=True)
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print("✅ Successfully deployed! Don't forget to press Ctrl+F5 on your browser.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Git Command Error: {e}")

def update_winner():
    # Basic validation check for required parameters
    if len(sys.argv) < 4:
        print("\n❌ Error: Missing arguments!")
        print("📋 Usage syntax: python update_winner.py [tournament] [season_number] [\"Winner Name (Team)\"]")
        print("💡 Example:      python update_winner.py division 6 \"PNE_SLAYERx7 ( Prabesh )\"")
        print("\nValid tournaments: league, division, camp, ultimate")
        return

    # Extract command line variables
    tourney_input = sys.argv[1].lower()
    season_num = sys.argv[2]
    winner_name = sys.argv[3]

    if tourney_input not in TOURNAMENT_MAP:
        print(f"❌ Error: '{tourney_input}' is invalid. Use: league, division, camp, or ultimate.")
        return

    target_key = TOURNAMENT_MAP[tourney_input]
    season_text = f"Season {season_num}"

    # Read the local app.js file
    file_path = "app.js"
    if not os.path.exists(file_path):
        print(f"❌ Error: Could not find '{file_path}' in the current folder.")
        return

    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    # Regex pattern to locate the start of the records array for the targeted tournament section
    pattern = rf"({target_key}:\s*\{{[^}}]*\brecords:\s*\[)"
    match = re.search(pattern, content)

    if not match:
        print(f"❌ Error: Failed to find the data list for '{target_key}' in your app.js layout.")
        return

    # Format the new JavaScript record entry line elegantly
    new_entry = f'\n      {{ season: "{season_text}", winner: "{winner_name}" }},'

    # Inject the new entry right after the 'records: [' array opening brackets tag
    updated_content = content[:match.end()] + new_entry + content[match.end():]

    # Save the updated layout back into app.js
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(updated_content)

    print(f"✨ Local update successful: Added {season_text} winner '{winner_name}' to {target_key}!")
    
    # Automatically execute Git deployment pipeline 
    commit_msg = f"data: update {tourney_input} season {season_num} record via command engine"
    run_git_commands(commit_msg)

if __name__ == "__main__":
    update_winner()