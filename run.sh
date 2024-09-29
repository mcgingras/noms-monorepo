#!/bin/bash

# Find and load environment variables from .env file
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Common parameters
fork_url="http://localhost:8545"
private_key="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

# Check if ALCHEMY_API_KEY is set
if [ -z "$ALCHEMY_API_KEY" ]; then
    echo "Error: ALCHEMY_API_KEY is not set in the .env file"
    exit 1
fi

# Check if port 8545 is in use
if lsof -i :8545 > /dev/null 2>&1; then
    echo "Port 8545 is in use. Attempting to kill the process..."

    # Get the PID of the process using port 8545
    PID=$(lsof -t -i :8545)

    # Kill the process
    kill -9 $PID

    echo "Process killed. Waiting a moment before starting Anvil..."
    sleep 2
else
    echo "Port 8545 is free."
fi

anvil --fork-url "https://base-mainnet.g.alchemy.com/v2/$ALCHEMY_API_KEY" --chain-id 1337 &
ANVIL_PID=$!

echo "Waiting for Anvil to start up before running scripts..."
sleep 5 # Wait for 5 seconds

# Array of scripts to run
scripts=(
    "./packages/contracts/script/Nom.s.sol:Deploy"
    "./packages/contracts/script/TraitDeployerManual.s.sol:Deploy"
)

# Loop through the scripts and run them
for script in "${scripts[@]}"; do
    echo "Running $script..."
    forge script "$script" --broadcast --fork-url "$fork_url" --private-key "$private_key"

    # Check if the script ran successfully
    if [ $? -eq 0 ]; then
        echo "$script completed successfully."
    else
        echo "Error: $script failed to run."
        exit 1
    fi

    echo "-----------------------------------"
done

echo "All foundry deploy scripts have been executed."

# Generate ABIs with wagmi
echo "Generating ABIs with wagmi..."
npx wagmi generate

# Check if wagmi generate was successful
if [ $? -eq 0 ]; then
    echo "ABIs generated successfully."
else
    echo "Error: Failed to generate ABIs."
    kill $ANVIL_PID
    exit 1
fi

# Run Ponder indexing service
echo "Starting Ponder indexing service..."
npx ponder dev

# Keep the script running and Anvil process alive
echo "Keeping Anvil running. Press Ctrl+C to stop."
wait $ANVIL_PID
