#!/bin/bash

# Set your GitHub username and repository name
GITHUB_USERNAME="sam-of-flutter"
REPO_NAME="facebook-scrapper"

# Initialize a local Git repository
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub
curl -u $GITHUB_USERNAME https://api.github.com/user/repos -d '{"name":"'$REPO_NAME'"}'

# Connect the local repository to the GitHub repository
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
git branch -M main
git push -u origin main

# Create a .gitignore file
echo -e "node_modules/\n.env" > .gitignore

# Add, commit, and push changes
git add .
git commit -m "Add .gitignore"
git push -u origin main

# Open VS Code or your preferred code editor
code .

# Print a message indicating completion
echo "GitHub repository created and configured successfully!"

