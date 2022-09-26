#!/usr/bin/env bash
local_branch_name="$(git rev-parse --abbrev-ref HEAD)"

valid_branch_regex="^(bug|feature|task|userstory)\/(\d{1,7})(\-{1}[\w\-]{1,})?"

task_id_in_branch=$(echo $(git rev-parse --abbrev-ref HEAD) | grep -o -E "$valid_branch_regex")

message="There is something wrong with your branch name. Branch names in this project must adhere to this contract: $valid_branch_regex. Your commit will be rejected. You should rename your branch to a valid name and try again."

if [[ -z "$task_id_in_branch" ]]; then
    echo "$message"
    exit 1
fi

exit 0
