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

    # Isolate the specific tournament data block to prevent accidental matches elsewhere
    block_pattern = rf"({target_key}:\s*\{{[^}}]*\brecords:\s*\[)([^\]]*?)(\s*\])"
    block_match = re.search(block_pattern, content)

    if not block_match:
        print(f"❌ Error: Failed to find the data list for '{target_key}' in your app.js layout.")
        return

    full_block = block_match.group(0)
    prefix = block_match.group(1)
    records_content = block_match.group(2)
    suffix = block_match.group(3)

    # Search for an existing entry matching the season name inside this block
    season_line_pattern = rf'{{\s*season:\s*"{season_text}"\s*,\s*winner:\s*"[^"]*"\s*}},?'
    
    if re.search(season_line_pattern, records_content):
        # REPLACE existing old entry
        print(f"🔄 Found an existing record for {season_text} under {target_key}. Swapping winner name...")
        new_line = f'{{ season: "{season_text}", winner: "{winner_name}" }},'
        updated_records = re.sub(season_line_pattern, new_line, records_content)
        updated_block = prefix + updated_records + suffix
        updated_content = content.replace(full_block, updated_block)
        action_text = "replaced"
    else:
        # INSERT new entry at the top of the array
        print(f"✨ No existing record found for {season_text}. Inserting new entry at the top...")
        new_entry = f'\n      {{ season: "{season_text}", winner: "{winner_name}" }},'
        updated_content = content[:block_match.end(1)] + new_entry + content[block_match.end(1):]
        action_text = "added"

    # Save the cleaned updates back into app.js safely
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(updated_content)

    print(f"✨ Local update successful: Successfully {action_text} {season_text} winner with '{winner_name}'!")
    
    # Automatically execute Git deployment pipeline 
    commit_msg = f"data: {action_text} {tourney_input} season {season_num} record via engine"
    run_git_commands(commit_msg)

if __name__ == "__main__":
    update_winner()
