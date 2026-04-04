#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  senten-commit.sh
#  Powered by Senten — The Contextual Committer
#  Stages all changes, drafts a Conventional Commit message
#  from the diff, asks for confirmation, then pushes.
# ─────────────────────────────────────────────────────────

set -e

# ── Colors ──────────────────────────────────────────────
BOLD="\033[1m"
CYAN="\033[1;36m"
YELLOW="\033[1;33m"
GREEN="\033[1;32m"
RED="\033[1;31m"
DIM="\033[2m"
RESET="\033[0m"

echo -e "\n${CYAN}${BOLD}⟡  Senten — The Contextual Committer${RESET}"
echo -e "${DIM}──────────────────────────────────────────${RESET}\n"

# ── 1. Stage all changes ─────────────────────────────────
echo -e "${BOLD}[1/4]${RESET} Staging all changes…"
git add .

STAGED=$(git diff --cached --name-only)
if [[ -z "$STAGED" ]]; then
  echo -e "${YELLOW}Nothing to commit. Working tree is clean.${RESET}"
  exit 0
fi

# ── 2. Analyse what changed ──────────────────────────────
echo -e "\n${BOLD}[2/4]${RESET} Analysing diff…\n"
git diff --cached --stat
echo ""

# Collect changed file paths
CHANGED_FILES=$(git diff --cached --name-only)
CHANGED_COUNT=$(echo "$CHANGED_FILES" | wc -l | tr -d ' ')

# ── 3. Infer Conventional Commit type & scope ────────────
TYPE="chore"
SCOPE=""

# Check for specific file patterns and assign type + scope
if echo "$CHANGED_FILES" | grep -qE "^\.github/workflows/"; then
  TYPE="ci"; SCOPE="workflows"
elif echo "$CHANGED_FILES" | grep -qE "^\.github/agents/"; then
  TYPE="chore"; SCOPE="agents"
elif echo "$CHANGED_FILES" | grep -qE "^app/Http/Controllers/"; then
  TYPE="feat"; SCOPE="controllers"
elif echo "$CHANGED_FILES" | grep -qE "^app/Models/"; then
  TYPE="feat"; SCOPE="models"
elif echo "$CHANGED_FILES" | grep -qE "^database/migrations/"; then
  TYPE="feat"; SCOPE="migrations"
elif echo "$CHANGED_FILES" | grep -qE "^database/seeders/"; then
  TYPE="chore"; SCOPE="seeders"
elif echo "$CHANGED_FILES" | grep -qE "^resources/views/|^resources/js/|^resources/css/"; then
  TYPE="feat"; SCOPE="ui"
elif echo "$CHANGED_FILES" | grep -qE "^routes/"; then
  TYPE="feat"; SCOPE="routes"
elif echo "$CHANGED_FILES" | grep -qE "^tests/"; then
  TYPE="test"; SCOPE="tests"
elif echo "$CHANGED_FILES" | grep -qE "^config/"; then
  TYPE="chore"; SCOPE="config"
elif echo "$CHANGED_FILES" | grep -qE "^(composer\.json|composer\.lock|package\.json|package-lock\.json)"; then
  TYPE="chore"; SCOPE="deps"
elif echo "$CHANGED_FILES" | grep -qE "\.(md|txt)$"; then
  TYPE="docs"; SCOPE="readme"
elif echo "$CHANGED_FILES" | grep -qE "^(Dockerfile|docker-compose|\.docker|docker/)"; then
  TYPE="chore"; SCOPE="docker"
fi

# Build a short subject from the first changed file (strip path, extension)
FIRST_FILE=$(echo "$CHANGED_FILES" | head -1)
BASENAME=$(basename "$FIRST_FILE" | sed 's/\.[^.]*$//')

if [[ $CHANGED_COUNT -eq 1 ]]; then
  SUBJECT="${TYPE}${SCOPE:+(${SCOPE})}: update ${BASENAME}"
else
  SUBJECT="${TYPE}${SCOPE:+(${SCOPE})}: update ${BASENAME} and $((CHANGED_COUNT - 1)) other file(s)"
fi

# Trim subject to 50 chars
SUBJECT="${SUBJECT:0:72}"

# Build bullet list of changed files for the body
BODY_LINES=""
while IFS= read -r f; do
  BODY_LINES+="- ${f}\n"
done <<< "$CHANGED_FILES"

# ── 4. Present draft & confirm ───────────────────────────
echo -e "${BOLD}[3/4]${RESET} ${CYAN}Senten's draft commit message:${RESET}\n"
echo -e "${BOLD}  Subject :${RESET} ${SUBJECT}"
echo -e "${BOLD}  Files   :${RESET}"
echo "$CHANGED_FILES" | sed 's/^/    • /'
echo ""

echo -e "${YELLOW}Options:${RESET}"
echo -e "  ${BOLD}y${RESET}  — accept & push"
echo -e "  ${BOLD}e${RESET}  — edit the subject, then push"
echo -e "  ${BOLD}n${RESET}  — abort"
echo ""
read -rp "$(echo -e "${BOLD}Your choice [y/e/n]:${RESET} ")" CHOICE

case "$CHOICE" in
  e|E)
    read -rp "$(echo -e "${BOLD}New subject (leave blank to keep current):${RESET} ")" NEW_SUBJECT
    if [[ -n "$NEW_SUBJECT" ]]; then
      SUBJECT="$NEW_SUBJECT"
    fi
    ;;
  n|N)
    echo -e "\n${RED}Aborted. Changes remain staged.${RESET}\n"
    exit 0
    ;;
esac

# ── 5. Commit & push ─────────────────────────────────────
echo -e "\n${BOLD}[4/4]${RESET} Committing…"

BODY_TEXT=$(printf "Changed files:\n%b" "$BODY_LINES")
git commit -m "$SUBJECT" -m "$BODY_TEXT"

echo -e "\n${GREEN}✓ Committed.${RESET} Pushing to remote…\n"
git push

BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "\n${GREEN}${BOLD}✓ Pushed to ${BRANCH}.${RESET}\n"
echo -e "${DIM}Run: git log --oneline -5 to verify.${RESET}\n"
