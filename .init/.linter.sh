#!/bin/bash
cd /home/kavia/workspace/code-generation/meme-creator-studio-312364-312374/meme_generator_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

